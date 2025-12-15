'use client';

import { useEffect, useState } from 'react';
import { Ban, Phone, Mail, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface PlatformContact {
    phone: string;
    email: string;
    location: string;
    description: string;
}

export default function SuspendedPage() {
    const [contact, setContact] = useState<PlatformContact | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch contact details without using authenticated API client
        const fetchContact = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/platform-contact`);
                const data = await response.json();
                if (data.success && data.data) {
                    setContact(data.data);
                }
            } catch (error) {
                console.error('Failed to fetch contact:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchContact();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex items-center justify-center p-4">
            <Card className="w-full max-w-md border-2 border-destructive/30 shadow-2xl">
                <CardHeader className="text-center pb-4">
                    <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
                        <Ban className="h-8 w-8 text-destructive" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-destructive">
                        Account Suspended
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <p className="text-center text-muted-foreground">
                        Your account has been suspended. If you believe this is a mistake or need assistance, please contact our support team.
                    </p>

                    {loading ? (
                        <div className="flex justify-center py-4">
                            <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : contact ? (
                        <div className="space-y-3 bg-muted/50 rounded-xl p-4 border border-border">
                            <h3 className="font-semibold text-sm text-foreground mb-3">Contact Support</h3>

                            {contact.phone && (
                                <a
                                    href={`tel:${contact.phone}`}
                                    className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors"
                                >
                                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <Phone className="h-4 w-4 text-primary" />
                                    </div>
                                    <span>{contact.phone}</span>
                                </a>
                            )}

                            {contact.email && (
                                <a
                                    href={`mailto:${contact.email}`}
                                    className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors"
                                >
                                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <Mail className="h-4 w-4 text-primary" />
                                    </div>
                                    <span>{contact.email}</span>
                                </a>
                            )}

                            {contact.location && (
                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <MapPin className="h-4 w-4 text-primary" />
                                    </div>
                                    <span>{contact.location}</span>
                                </div>
                            )}
                        </div>
                    ) : (
                        <p className="text-center text-sm text-muted-foreground">
                            Please contact our support team for assistance.
                        </p>
                    )}

                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => window.location.href = '/'}
                    >
                        Return to Home
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
