import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser, SignOutButton } from "@clerk/clerk-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Mail,
  Calendar,
  Shield,
  LogOut,
  Copy,
  CheckCircle2,
  Settings,
  Lock,
  Bell,
  History,
  Activity,
  CreditCard,
  ArrowLeft,
} from "lucide-react";
import { userAPI } from "@/services/apiService";

function Profile() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [loading, setLoading] = React.useState(true);
  const [copiedEmail, setCopiedEmail] = React.useState(false);
  const [copiedClerkId, setCopiedClerkId] = React.useState(false);

  React.useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        await userAPI.getUserByClerkId(user.id, user.id);
      } catch (err) {
        console.error("Error fetching user data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchUserData();
    }
  }, [user?.id]);

  const handleCopyEmail = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopyClerkId = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedClerkId(true);
    setTimeout(() => setCopiedClerkId(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const initials = user?.firstName?.charAt(0) + user?.lastName?.charAt(0);
  const createdDate = new Date(user?.createdAt).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-blue-50/30 to-indigo-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-8 space-y-6">
        {/* Back Button */}
        <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600 mt-1">
              Manage your account information and settings
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card className="border-2">
              <CardHeader className="text-center space-y-4">
                <div className="flex justify-center">
                  <Avatar className="w-24 h-24 border-4 border-blue-600">
                    <AvatarImage src={user?.imageUrl} />
                    <AvatarFallback className="bg-blue-600 text-white text-2xl font-bold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </h2>
                  <Badge variant="secondary" className="text-xs">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Verified Member
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => navigate("/accounts")}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    My Accounts
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => navigate("/transactions")}
                  >
                    <Activity className="w-4 h-4 mr-2" />
                    Transactions
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => navigate("/history")}
                  >
                    <History className="w-4 h-4 mr-2" />
                    History
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Account Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Name */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                      First Name
                    </label>
                    <p className="text-lg text-gray-900 bg-gray-50 p-3 rounded-lg">
                      {user?.firstName}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Last Name
                    </label>
                    <p className="text-lg text-gray-900 bg-gray-50 p-3 rounded-lg">
                      {user?.lastName}
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Primary Email
                  </label>
                  <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                    <p className="text-lg text-gray-900 flex-1">
                      {user?.primaryEmailAddress?.emailAddress}
                    </p>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        handleCopyEmail(user?.primaryEmailAddress?.emailAddress)
                      }
                    >
                      {copiedEmail ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                </div>

                <Separator />

                {/* Phone */}
                {user?.primaryPhoneNumber && (
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Phone Number
                    </label>
                    <p className="text-lg text-gray-900 bg-gray-50 p-3 rounded-lg">
                      {user?.primaryPhoneNumber?.phoneNumber}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Account Details */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  Account Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Clerk ID */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Clerk ID
                  </label>
                  <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600 font-mono flex-1">
                      {user?.id}
                    </p>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCopyClerkId(user?.id)}
                    >
                      {copiedClerkId ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Member Since */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Member Since
                  </label>
                  <p className="text-lg text-gray-900 bg-gray-50 p-3 rounded-lg">
                    {createdDate}
                  </p>
                </div>

                <Separator />

                {/* Account Status */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Account Status
                  </label>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-600 hover:bg-green-700 text-lg px-4 py-2">
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Active
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Info */}
            <Card className="border-2 border-amber-200 bg-amber-50">
              <CardHeader>
                <CardTitle className="text-amber-900 flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-amber-900">
                <p className="text-sm">
                  ✓ Two-factor authentication is enabled through Clerk
                </p>
                <p className="text-sm">
                  ✓ Your account is protected with enterprise-grade encryption
                </p>
                <p className="text-sm">
                  ✓ All transactions are logged and monitored
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sign Out Button */}
        <div className="flex justify-center">
          <SignOutButton>
            <Button className="px-8 bg-red-600 hover:bg-red-700">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </SignOutButton>
        </div>
      </div>
    </div>
  );
}

export default Profile;