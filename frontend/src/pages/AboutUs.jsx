import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Shield,
  Users,
  TrendingUp,
  Zap,
  Globe,
  Lock,
  Heart,
} from "lucide-react";

function AboutUs() {
  const navigate = useNavigate();

  const values = [
    {
      icon: Shield,
      title: "Security First",
      description:
        "Your financial data is protected with bank-level encryption and security measures",
    },
    {
      icon: Users,
      title: "Customer Centric",
      description:
        "We prioritize customer satisfaction and provide 24/7 support for all your needs",
    },
    {
      icon: TrendingUp,
      title: "Growth Focused",
      description:
        "Helping our customers grow their wealth through smart financial management",
    },
    {
      icon: Zap,
      title: "Fast & Reliable",
      description: "Lightning-fast transactions with 99.9% uptime guarantee",
    },
  ];

  const team = [
    {
      name: "John Smith",
      role: "Founder & CEO",
      description:
        "With 15+ years in fintech, leading the vision for modern banking",
    },
    {
      name: "Sarah Johnson",
      role: "Chief Technology Officer",
      description: "Expert in blockchain and secure financial systems",
    },
    {
      name: "Michael Chen",
      role: "Head of Customer Success",
      description: "Dedicated to ensuring every customer success story",
    },
    {
      name: "Emily Rodriguez",
      role: "Chief Financial Officer",
      description: "Managing financial operations with precision and integrity",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-blue-50/30 to-indigo-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-6 md:pt-8 space-y-6 pb-12">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Button>

        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">About Royal Mint</h1>
          <p className="text-gray-600 text-lg">
            Learn about our mission, values, and the team behind secure banking
          </p>
        </div>

        {/* Mission Section */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-600" />
              Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              At Royal Mint, we believe everyone deserves access to secure,
              efficient, and transparent banking services. Our mission is to
              revolutionize the financial industry by providing cutting-edge
              technology combined with exceptional customer service.
            </p>
            <p className="text-gray-700 leading-relaxed">
              We're committed to creating a platform where users can manage
              their finances with confidence, transact without boundaries, and
              grow their wealth responsibly.
            </p>
          </CardContent>
        </Card>

        {/* Values Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="border-gray-200 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Icon className="w-5 h-5 text-blue-600" />
                      {value.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-gray-200 shadow-sm text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">10K+</div>
              <p className="text-sm text-gray-600 mt-1">Active Users</p>
            </CardContent>
          </Card>
          <Card className="border-gray-200 shadow-sm text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">$500M+</div>
              <p className="text-sm text-gray-600 mt-1">Transactions</p>
            </CardContent>
          </Card>
          <Card className="border-gray-200 shadow-sm text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-purple-600">50+</div>
              <p className="text-sm text-gray-600 mt-1">Countries</p>
            </CardContent>
          </Card>
          <Card className="border-gray-200 shadow-sm text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-orange-600">99.9%</div>
              <p className="text-sm text-gray-600 mt-1">Uptime</p>
            </CardContent>
          </Card>
        </div>

        {/* Team Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {team.map((member, index) => (
              <Card key={index} className="border-gray-200 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <p className="text-sm text-blue-600 font-semibold">
                    {member.role}
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center space-y-4">
          <h3 className="text-2xl font-bold text-gray-900">
            Ready to Join Us?
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Start your journey with Royal Mint today and experience the future
            of banking
          </p>
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8"
            onClick={() => navigate("/dashboard")}
          >
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
