import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DebugAuth() {
  const [authData, setAuthData] = useState(null);
  const [userEntityData, setUserEntityData] = useState(null);
  const [allUsers, setAllUsers] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDebugData();
  }, []);

  const loadDebugData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("🔍 === AUTH DEBUG START ===");
      
      // 1. Check if authenticated
      const isAuth = await base44.auth.isAuthenticated();
      console.log("✅ Is Authenticated:", isAuth);
      
      if (!isAuth) {
        setError("Not authenticated. Please log in first.");
        setIsLoading(false);
        return;
      }

      // 2. Get auth.me() data
      const meData = await base44.auth.me();
      console.log("✅ auth.me() response:", meData);
      setAuthData(meData);

      // 3. Try to read User entity for current user
      try {
        const userRecords = await base44.entities.User.filter({ 
          email: meData.email 
        });
        console.log("✅ User entity records:", userRecords);
        setUserEntityData(userRecords[0] || null);
      } catch (userError) {
        console.error("❌ Error reading User entity:", userError);
        setUserEntityData({ error: userError.message });
      }

      // 4. List all users (if admin)
      try {
        const users = await base44.entities.User.list();
        console.log("✅ All User records:", users);
        setAllUsers(users);
      } catch (listError) {
        console.log("⚠️ Cannot list all users (not admin or RLS blocked):", listError.message);
        setAllUsers({ error: listError.message });
      }

      console.log("🔍 === AUTH DEBUG END ===");
      
    } catch (err) {
      console.error("❌ Fatal error:", err);
      setError(err.message);
    }
    
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ranch-cream flex items-center justify-center p-4">
        <Card>
          <CardContent className="pt-6">
            <p>Loading debug data...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ranch-cream py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-ranch-charcoal">🔍 Auth Debug Page</h1>
          <Button onClick={loadDebugData}>Refresh Data</Button>
        </div>

        {error && (
          <Card className="border-red-500">
            <CardHeader>
              <CardTitle className="text-red-600">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-700">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Auth.me() Data */}
        <Card>
          <CardHeader>
            <CardTitle>1️⃣ base44.auth.me() Response</CardTitle>
          </CardHeader>
          <CardContent>
            {authData ? (
              <pre className="bg-gray-100 p-4 rounded overflow-auto text-xs">
                {JSON.stringify(authData, null, 2)}
              </pre>
            ) : (
              <p className="text-gray-500">Not authenticated</p>
            )}
          </CardContent>
        </Card>

        {/* User Entity Data */}
        <Card>
          <CardHeader>
            <CardTitle>2️⃣ User Entity Record (for current email)</CardTitle>
          </CardHeader>
          <CardContent>
            {userEntityData ? (
              userEntityData.error ? (
                <div className="text-red-600">
                  <p className="font-semibold">❌ Error reading User entity:</p>
                  <p className="text-sm">{userEntityData.error}</p>
                </div>
              ) : (
                <pre className="bg-gray-100 p-4 rounded overflow-auto text-xs">
                  {JSON.stringify(userEntityData, null, 2)}
                </pre>
              )
            ) : (
              <p className="text-yellow-600">⚠️ No User entity record found for this email!</p>
            )}
          </CardContent>
        </Card>

        {/* All Users */}
        <Card>
          <CardHeader>
            <CardTitle>3️⃣ All User Entity Records</CardTitle>
          </CardHeader>
          <CardContent>
            {allUsers ? (
              allUsers.error ? (
                <div className="text-gray-600">
                  <p className="font-semibold">⚠️ Cannot list users:</p>
                  <p className="text-sm">{allUsers.error}</p>
                  <p className="text-xs mt-2">(This is normal if you're not an admin)</p>
                </div>
              ) : (
                <div>
                  <p className="mb-2 font-semibold">Found {allUsers.length} user(s):</p>
                  <pre className="bg-gray-100 p-4 rounded overflow-auto text-xs max-h-96">
                    {JSON.stringify(allUsers, null, 2)}
                  </pre>
                </div>
              )
            ) : (
              <p className="text-gray-500">No data</p>
            )}
          </CardContent>
        </Card>

        {/* Test Booking */}
        <Card>
          <CardHeader>
            <CardTitle>4️⃣ Test Booking Creation</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={async () => {
                try {
                  console.log("🧪 Testing booking creation...");
                  const testBooking = await base44.entities.PicleballBooking.create({
                    name: authData.full_name,
                    email: authData.email,
                    phone: authData.phone || "",
                    preferred_date: "2025-12-31",
                    preferred_time: "10:00 AM",
                    selected_courts: [1],
                    duration: "1_hour",
                    message: "Test booking from debug page"
                  });
                  console.log("✅ Test booking created:", testBooking);
                  alert("✅ Success! Booking created: " + testBooking.id);
                } catch (err) {
                  console.error("❌ Test booking failed:", err);
                  alert("❌ Failed: " + err.message);
                }
              }}
              className="ranch-gradient text-white"
            >
              Test Create Booking
            </Button>
            <p className="text-xs text-gray-600 mt-2">
              This will attempt to create a test booking using the current user's data.
            </p>
          </CardContent>
        </Card>

        <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">📋 Instructions:</h3>
          <ol className="text-sm text-yellow-700 space-y-1 list-decimal list-inside">
            <li>Check if auth.me() returns your email correctly</li>
            <li>Check if a User entity record exists for your email</li>
            <li>Click "Test Create Booking" to see if the 403 still happens</li>
            <li>Take a screenshot of this page and send it to me</li>
          </ol>
        </div>
      </div>
    </div>
  );
}