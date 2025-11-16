import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSocketStore } from "@/store/useSocketStore";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMyDetails } from "@/services/authService";

export default function Profile() {

    const rawUser = localStorage.getItem("user");
    const userInfo = rawUser ? JSON.parse(rawUser) : null;

    const token = localStorage.getItem("token") || "";
    const makeUserActive = useSocketStore((s) => s.makeUserActive);

    useEffect(() => {
        // console.log("token", token)
        if (userInfo?.id && token) {
            makeUserActive(userInfo.id, token);
        }
    }, []);

    const { data, isLoading, error } = useQuery({
        queryKey: ["my-details"],
        queryFn: getMyDetails,
        retry: false,
    });

    if (isLoading) {
        return <div className="flex justify-center mt-10">Loading...</div>;
    }

    if (error || !data?.user) {
        return <div>Error loading profile</div>;
    }

    const user = data.user;


    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <Card className="w-full max-w-lg shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl font-semibold text-center flex items-center justify-center gap-2">
                        Your Profile

                        {/* ONLINE BADGE */}
                        {user.isOnline && (
                            <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
                        )}
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-5">

                    {/* Username */}
                    <div>
                        <label className="text-sm font-medium">Username</label>
                        <Input value={user.username} readOnly />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="text-sm font-medium">Email</label>
                        <Input value={user.email} readOnly />
                    </div>

                    {/* Online Status */}
                    <div>
                        <label className="text-sm font-medium">Status</label>
                        <Input
                            value={user.isOnline ? "🟢 Online" : "⚫ Offline"}
                            readOnly
                        />
                    </div>

                    {/* Token */}
                    <div>
                        <label className="text-sm font-medium">Auth Token</label>
                        <Input
                            value={token}
                            readOnly
                            className="font-mono text-xs"
                        />
                    </div>

                    <Button className="w-full">Edit Profile (Coming Soon)</Button>
                </CardContent>
            </Card>
        </div>
    );
}
