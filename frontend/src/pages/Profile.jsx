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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-5">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 text-base mt-1">
            Manage your account information
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-5 items-start">
          {/* Profile Card */}
          <div className="h-[90%]">
            <Card className="shadow-sm border h-full flex flex-col">
              <CardHeader className="text-center pb-3 pt-4">
                <div className="flex justify-center mb-3">
                  <Avatar className="w-20 h-20 border-2 border-blue-500">
                    <AvatarImage src={user?.imageUrl} />
                    <AvatarFallback className="bg-blue-600 text-white text-xl font-bold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  {user?.firstName} {user?.lastName}
                </h2>
                <Badge className="bg-green-100 text-green-700 text-sm mt-1">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4 pb-4 pt-2 flex-1">
                <Button
                  variant="outline"
                  className="w-full justify-start text-sm hover:bg-blue-50"
                  onClick={() => navigate("/accounts")}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Accounts
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-sm hover:bg-indigo-50"
                  onClick={() => navigate("/transactions")}
                >
                  <Activity className="w-4 h-4 mr-2" />
                  Transactions
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-sm hover:bg-purple-50"
                  onClick={() => navigate("/history")}
                >
                  <History className="w-4 h-4 mr-2" />
                  History
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Account Information */}
          <div className="space-y-5">
            {/* Personal Info and Account Details Side by Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Personal Information */}
              <Card className="shadow-sm border">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <User className="w-5 h-5 text-blue-600" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        First Name
                      </label>
                      <p className="text-base font-semibold text-gray-900 mt-1">
                        {user?.firstName}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Last Name
                      </label>
                      <p className="text-base font-semibold text-gray-900 mt-1">
                        {user?.lastName}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      Email
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-base font-semibold text-gray-900 flex-1 truncate">
                        {user?.primaryEmailAddress?.emailAddress}
                      </p>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={() =>
                          handleCopyEmail(user?.primaryEmailAddress?.emailAddress)
                        }
                      >
                        {copiedEmail ? (
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-600" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {user?.primaryPhoneNumber && (
                    <>
                      <Separator />
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Phone
                        </label>
                        <p className="text-base font-semibold text-gray-900 mt-1">
                          {user?.primaryPhoneNumber?.phoneNumber}
                        </p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Account Details */}
              <Card className="shadow-sm border">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Shield className="w-5 h-5 text-indigo-600" />
                    Account Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      User ID
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm text-gray-700 font-mono flex-1 truncate">
                        {user?.id}
                      </p>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={() => handleCopyClerkId(user?.id)}
                      >
                        {copiedClerkId ? (
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-600" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Member Since
                    </label>
                    <p className="text-base font-semibold text-gray-900 mt-1">
                      {createdDate}
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Status
                    </label>
                    <div className="mt-1">
                      <Badge className="bg-green-600 text-white text-sm px-3 py-1">
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        Active
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Security Info */}
            <Card className="shadow-sm border bg-amber-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-amber-900 flex items-center gap-2 text-lg">
                  <Lock className="w-5 h-5" />
                  Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-amber-900">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                  <p className="text-sm">2FA enabled via Clerk</p>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                  <p className="text-sm">Enterprise encryption</p>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                  <p className="text-sm">Transaction monitoring</p>
                </div>
              </CardContent>
            </Card>

            {/* Sign Out Button */}
            <div className="flex justify-end">
              <SignOutButton>
                <Button variant="destructive" className="px-6 text-white">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </SignOutButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;