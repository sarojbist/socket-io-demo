import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSocketStore } from "@/store/useSocketStore";
import { useEffect } from "react";

export default function Profile() {

    const rawUser = localStorage.getItem("user");
    const user = rawUser ? JSON.parse(rawUser) : null;

    const token = localStorage.getItem("token") || "";
    const makeUserActive = useSocketStore((s) => s.makeUserActive);

    useEffect(() => {
        console.log("token", token)
        if ( user?.id && token) {
            makeUserActive(user.id, token);
        }
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <Card className="w-full max-w-lg shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl font-semibold text-center">
                        Your Profile
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-5">
                    <div>
                        <label className="text-sm font-medium">Username</label>
                        <Input value={user?.username || ""} readOnly />
                    </div>

                    <div>
                        <label className="text-sm font-medium">Email</label>
                        <Input value={user?.email || ""} readOnly />
                    </div>

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
