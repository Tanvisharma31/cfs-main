"use client"

import { EnhancedHeader } from "@/components/enhanced-header"
import { EnhancedFooter } from "@/components/enhanced-footer"
import { FadeInSection } from "@/components/fade-in-section"
import { AnimatedBackground } from "@/components/animated-background"
import { FloatingElements } from "@/components/floating-elements"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getBasePrice } from "@/lib/pricing"
import {
  ArrowRight,
  Phone,
  Users,
  FileCheck,
  Landmark,
  ShieldAlert
} from "lucide-react"

export default function PtTaxFilingPage() {
  const basePrice = getBasePrice("pt tax filing") ?? "As per request";
  
  return (
    <div className="min-h-screen bg-white">
      <EnhancedHeader />

      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center pt-20">
        <AnimatedBackground />
        <FloatingElements />

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeInSection className="space-y-8">
              <div className="space-y-6">
                <Badge className="bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 hover:from-purple-200 hover:to-purple-300 animate-pulse border-0 px-4 py-2">
                  State-Level Compliance
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-gray-900 via-purple-600 to-gray-900 bg-clip-text text-transparent">
                    Professional Tax
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-purple-500 via-purple-400 to-purple-600 bg-clip-text text-transparent">
                    Filing Made Easy
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Fulfill your state-mandated professional tax obligations effortlessly. We ensure accurate, on-time filing to keep your business compliant.
                </p>

                <div className="grid sm:grid-cols-3 gap-4 pt-6">
                  <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                    <div className="text-2xl font-bold text-purple-600">{basePrice}</div>
                    <div className="text-sm text-gray-600">Per Year</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                    <div className="text-2xl font-bold text-purple-600">Annual</div>
                    <div className="text-sm text-gray-600">Filing Cycle</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                    <div className="text-2xl font-bold text-purple-600">State-Wide</div>
                    <div className="text-sm text-gray-600">Compliance</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-6">
                  <Button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    Start PT Filing
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    className="border-2 border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white px-8 py-3 rounded-full transition-all duration-300 hover:scale-105 bg-transparent"
                  >
                    Consult an Expert
                  </Button>
                </div>
              </div>
            </FadeInSection>
            <FadeInSection className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-100 to-transparent rounded-full -translate-x-10 -translate-y-10"></div>
                <img
                  src="/images/pt-tax-hero.svg"
                  alt="Professional Tax Filing Illustration"
                  className="relative rounded-lg shadow-2xl w-full h-auto"
                />
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* Why Comply Section */}
      <FadeInSection>
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto mb-16">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-purple-600 bg-clip-text text-transparent">Why PT Compliance is Essential</h2>
              <p className="text-lg text-gray-600">
                Staying compliant with Professional Tax regulations is a legal necessity that protects your business.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="text-center p-6 border-2 border-transparent hover:border-purple-200 hover:shadow-xl transition-all">
                <Landmark className="mx-auto h-12 w-12 text-purple-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Legal Requirement</h3>
                <p className="text-gray-600">It is a mandatory tax levied by state governments on all professionals and salaried individuals.</p>
              </Card>
              <Card className="text-center p-6 border-2 border-transparent hover:border-purple-200 hover:shadow-xl transition-all">
                <ShieldAlert className="mx-auto h-12 w-12 text-purple-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Avoid Penalties</h3>
                <p className="text-gray-600">Timely filing and payment prevent hefty penalties and interest charges for non-compliance.</p>
              </Card>
              <Card className="text-center p-6 border-2 border-transparent hover:border-purple-200 hover:shadow-xl transition-all">
                <FileCheck className="mx-auto h-12 w-12 text-purple-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Smooth Operations</h3>
                <p className="text-gray-600">Ensures your business operations run smoothly without any legal interruptions from state authorities.</p>
              </Card>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* CTA Section */}
      <FadeInSection>
        <section className="py-20 bg-gradient-to-r from-purple-600 to-purple-800 text-white">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto space-y-8">
              <h2 className="text-4xl lg:text-5xl font-bold">Handle Your PT Obligations Now</h2>
              <p className="text-xl text-purple-100 leading-relaxed">
                Let us take care of your Professional Tax filings so you can focus on what you do best.
              </p>
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Button className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all">
                  File Your PT Return
                  <Users className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 text-lg rounded-full transition-all bg-transparent">
                  Talk to an Expert
                  <Phone className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>

      <EnhancedFooter />
    </div>
  )
}

