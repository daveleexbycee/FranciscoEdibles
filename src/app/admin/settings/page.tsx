
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
    return (
        <div className="space-y-4">
             <div>
                <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
                <p className="text-muted-foreground">
                    Manage your restaurant settings and preferences.
                </p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Under Construction</CardTitle>
                    <CardDescription>
                        This settings page is currently under construction. More features coming soon!
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center text-muted-foreground border">
                        <p>Settings form will be here.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
