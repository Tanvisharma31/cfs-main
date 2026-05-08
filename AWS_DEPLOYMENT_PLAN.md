# Comprehensive AWS Deployment Strategy (Cost-Effective & Secure)

This guide provides a detailed roadmap for deploying your platform (Frontend, Admin, Contact, and Backend) on AWS. The architecture is specifically designed to be **highly secure**, **scalable**, and strictly **under ₹1,000/month (~$12 USD)**, taking full advantage of the AWS 12-Month Free Tier.

---

## 1. Architecture Recommendation

To achieve high scalability at the lowest possible cost, we will split the deployment into Serverless (Frontend) and lightweight Compute (Backend).

### 🖥️ Frontend, Admin & Contact Apps (Next.js)
**Service:** **AWS Amplify**
- **Why:** AWS Amplify natively supports Next.js SSR (Server-Side Rendering). It uses AWS CloudFront (CDN) and Lambda under the hood. 
- **Cost:** Covered under the Free Tier for 12 months (15 GB bandwidth/month). Post-free tier, it costs pennies based on actual traffic.
- **Security:** Built-in SSL/TLS certificates, DDoS protection via CloudFront.

### ⚙️ Backend API (Express.js)
**Service:** **AWS EC2 (`t3.micro` or `t4g.small`) + PM2 + Nginx**
- **Why:** Running a dedicated lightweight server is cheaper than API Gateway + Lambda for a traditional Express app. 
- **Cost:** `t3.micro` is **FREE** for 750 hours/month (24/7) for the first 12 months.
- **Security:** Placed in a VPC. Only ports 80 (HTTP) and 443 (HTTPS) exposed via Security Groups. SSL secured via Let's Encrypt (Certbot).

### 🗄️ Database
**Service:** **MongoDB Atlas (M0 Shared Cluster)**
- **Why:** Since you are already using MongoDB, Atlas is the best choice.
- **Cost:** M0 cluster is **FREE forever** (up to 512 MB of text data). 
- **Security:** IP Whitelisting (only allow your EC2 IP to connect).

### 📂 File Uploads (CRITICAL CHANGE)
**Service:** **AWS S3**
- **Current Issue:** You are currently using `multer-gridfs-storage` which stores files inside MongoDB. **You must change this.** If you store 5GB of uploads in MongoDB Atlas, you will exceed the free tier and be forced to pay ~$60/month for an M10 cluster.
- **Solution:** Store user uploads directly in AWS S3 buckets.
- **Cost:** AWS S3 Free Tier includes 5GB standard storage. After 12 months, 5GB costs **~$0.11/month**.
- **Security:** Buckets made private. Generate Pre-signed URLs for users to securely view/download files.

---

## 2. Cost Breakdown (For 1000 Users)

| Service | Purpose | First 6-12 Months Cost | Cost After Free Tier |
|---------|---------|------------------------|----------------------|
| **AWS EC2 (`t3.micro`)** | Express Backend | **$0** (Free Tier) | ~$7.50 / month |
| **AWS Amplify** | 3x Next.js Apps | **$0** (Free Tier up to 15GB) | ~$1.50 / month (approx $0.15/GB) |
| **AWS S3** | File Uploads (5GB) | **$0** (Free Tier) | ~$0.15 / month |
| **MongoDB Atlas**| Database | **$0** (Forever Free) | $0 |
| **AWS Route 53** | Domain DNS Management | ~$0.50 / month | ~$0.50 / month |
| **Total Estimated** | | **~$0.50 / month (₹40/mo)** | **~$9.65 / month (₹800/mo)** |

*✅ Strictly under ₹1000/month. Highly scalable.*

---

## 3. Step-by-Step Deployment Plan

### Phase 1: Preparation & Code Changes
1. **Migrate from GridFS to S3:**
   - Install `aws-sdk` and `multer-s3` in your backend.
   - Refactor your upload routes to save files to an S3 bucket instead of MongoDB.
2. **Environment Variables:**
   - Ensure all apps read dynamic URLs from `.env` (e.g., `NEXT_PUBLIC_API_URL`).

### Phase 2: Database & Storage Setup
1. **AWS S3:** Create an S3 Bucket (e.g., `cfs-user-uploads`). Block all public access. Configure IAM roles for your backend to access it.
2. **MongoDB Atlas:** Keep using your current cluster. Once the backend EC2 is set up, whitelist the EC2's Elastic IP address in Atlas Network Access.

### Phase 3: Backend Deployment (EC2)
1. **Launch Instance:** Go to AWS EC2, launch an Ubuntu 24.04 `t3.micro` instance.
2. **Security Group:** Open Ports `22` (SSH for you), `80` (HTTP), and `443` (HTTPS).
3. **Setup Server:**
   ```bash
   sudo apt update && sudo apt install nodejs npm nginx -y
   sudo npm install -g pm2
   ```
4. **Deploy Code:** Clone your repo to the server. Run `npm install` inside the `backend` folder.
5. **Start App:** `pm2 start server.js --name "cfs-backend"`
6. **Nginx & SSL:** Configure Nginx as a reverse proxy forwarding to port `5001`. Use `certbot` to install a free SSL certificate.

### Phase 4: Frontend Deployments (AWS Amplify)
1. Go to **AWS Amplify** in the AWS Console.
2. Connect your GitHub/GitLab repository.
3. Select the `frontend` folder as the root directory.
4. Amplify will automatically detect Next.js. Click Deploy.
5. Repeat the process for the `admin` and `contact` folders as separate Amplify Apps.
6. **Custom Domains:** In Amplify settings, map your domains (e.g., `admin.comfinserv.co`, `contact.comfinserv.co`). Amplify automatically provisions SSL certificates.

---

## 4. Security Measures Implemented
- **VPC & Firewalls:** Backend is protected by AWS Security Groups. No database ports are exposed to the public internet.
- **Data at Rest:** AWS S3 encrypts files automatically using AES-256.
- **Pre-signed URLs:** Files are never public. Users get temporary (e.g., 5-minute) links to view their uploaded tax/ROC documents.
- **DDoS Protection:** AWS CloudFront (via Amplify) absorbs Layer 3 and Layer 4 attacks automatically.
- **Rate Limiting:** Your existing `express-rate-limit` configuration will prevent brute-force attacks on the backend.

## 5. IAM Roles & Security Policies

To ensure strict security and follow the **Principle of Least Privilege**, we will use AWS IAM (Identity and Access Management) instead of hardcoding API keys.

### 1. EC2 Instance Profile Role (For Backend)
Instead of putting AWS Access Keys in your `.env` file, we will attach an IAM Role directly to the EC2 instance. This allows the backend to securely talk to S3.
*   **Role Name:** `CFS-Backend-S3-Access-Role`
*   **Trusted Entity:** EC2
*   **Policy Attached:** 
    ```json
    {
      "Version": "2012-10-17",
      "Statement": [
        {
          "Effect": "Allow",
          "Action": [
            "s3:PutObject",
            "s3:GetObject",
            "s3:DeleteObject"
          ],
          "Resource": "arn:aws:s3:::cfs-user-uploads/*"
        }
      ]
    }
    ```

### 2. S3 Bucket Policy & CORS
The S3 bucket itself will block all public access. When users want to view a file, the backend generates a temporary "Pre-signed URL".
*   **Block Public Access:** `ON` (All 4 settings checked).
*   **CORS Policy (Cross-Origin Resource Sharing):** Required so your frontend can display the documents seamlessly.
    ```json
    [
      {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "PUT", "POST"],
        "AllowedOrigins": ["https://admin.comfinserv.co", "https://contact.comfinserv.co", "https://comfinserv.co"],
        "ExposeHeaders": []
      }
    ]
    ```

### 3. IAM Programmatic User (For CLI & Local Development)
To allow you (or your CI/CD pipeline) to manage deployments, upload files locally during testing, or interact with AWS via the `aws-cli`, you need an IAM User with Programmatic Access (Access Key & Secret Key).
*   **User Name:** `CFS-CLI-Admin`
*   **Access Type:** Programmatic access only (No console password needed).
*   **Policy Attached:** 
    ```json
    {
      "Version": "2012-10-17",
      "Statement": [
        {
          "Effect": "Allow",
          "Action": [
            "s3:PutObject",
            "s3:GetObject",
            "s3:DeleteObject",
            "s3:ListBucket"
          ],
          "Resource": [
            "arn:aws:s3:::cfs-user-uploads",
            "arn:aws:s3:::cfs-user-uploads/*"
          ]
        },
        {
          "Effect": "Allow",
          "Action": [
            "ec2:DescribeInstances",
            "ec2:StartInstances",
            "ec2:StopInstances"
          ],
          "Resource": "*"
        }
      ]
    }
    ```
    *(Note: If you plan to manage Amplify via the CLI, you can attach the `AdministratorAccess-Amplify` AWS-managed policy to this user as well.)*

### 4. Amplify Service Role (For Frontend/Admin)
AWS Amplify automatically creates a service role (`AmplifyConsoleServiceRole-AmplifyRole`) during setup. This role grants Amplify permission to pull your code from GitHub and build the Next.js apps. You won't need to manually configure this, but it is part of the security architecture.

---

## 6. Next Steps
If you approve this architecture, the **first necessary technical step** is to rewrite the backend upload logic to replace MongoDB GridFS with AWS S3. Would you like me to generate the code for this migration?
