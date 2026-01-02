'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Truck, Save, IndianRupee, Target } from 'lucide-react';
import { toast } from 'sonner';
import { useDeliverySettings, useUpdateDeliverySettings } from '@/api/domains/admin-settings/queries';
import Loading from '@/components/shared/display/Loading';
import Error from '@/components/shared/display/Error';

export default function DeliveryFeesPage() {
    const { data: settings, isLoading, error, refetch } = useDeliverySettings();
    const updateMutation = useUpdateDeliverySettings();

    const [deliveryFee, setDeliveryFee] = useState(40);
    const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState(500);
    const [isEnabled, setIsEnabled] = useState(true);

    useEffect(() => {
        if (settings) {
            setDeliveryFee(settings.deliveryFee);
            setFreeDeliveryThreshold(settings.freeDeliveryThreshold);
            setIsEnabled(settings.isEnabled);
        }
    }, [settings]);

    const handleSave = async () => {
        try {
            await updateMutation.mutateAsync({
                deliveryFee,
                freeDeliveryThreshold,
                isEnabled,
            });
        } catch (error) {
            // Error handled by mutation
        }
    };

    if (isLoading) {
        return <Loading text="Loading delivery settings..." />;
    }

    if (error) {
        return <Error message="Failed to load delivery settings" onRetry={() => refetch()} />;
    }

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="space-y-2 sm:space-y-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
                        Delivery Fee Settings
                    </h1>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1.5">
                        Configure delivery charges for product orders
                    </p>
                </div>
            </div>

            <Card className="border-2 border-border rounded-lg sm:rounded-xl">
                <CardHeader className="space-y-1 pb-3 sm:pb-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <Truck className="h-5 w-5 text-primary flex-shrink-0" />
                        <CardTitle className="text-base sm:text-lg lg:text-xl">Delivery Configuration</CardTitle>
                    </div>
                    <CardDescription className="text-xs sm:text-sm">
                        Set the delivery fee amount and free delivery threshold
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6">
                    {/* Enable/Disable Toggle */}
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div className="space-y-0.5">
                            <Label htmlFor="enabled" className="text-sm font-medium">
                                Enable Delivery Charges
                            </Label>
                            <p className="text-xs text-muted-foreground">
                                When disabled, all deliveries are free
                            </p>
                        </div>
                        <Switch
                            id="enabled"
                            checked={isEnabled}
                            onCheckedChange={setIsEnabled}
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        {/* Delivery Fee */}
                        <div className="space-y-2">
                            <Label htmlFor="deliveryFee" className="text-xs sm:text-sm font-medium flex items-center gap-2">
                                <IndianRupee className="h-4 w-4 text-muted-foreground" />
                                Delivery Fee Amount
                            </Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₹</span>
                                <Input
                                    id="deliveryFee"
                                    type="number"
                                    min="0"
                                    value={deliveryFee}
                                    onChange={(e) => setDeliveryFee(Number(e.target.value))}
                                    className="pl-8 h-10 text-sm"
                                    placeholder="40"
                                    disabled={!isEnabled}
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Amount charged when order is below threshold
                            </p>
                        </div>

                        {/* Free Delivery Threshold */}
                        <div className="space-y-2">
                            <Label htmlFor="threshold" className="text-xs sm:text-sm font-medium flex items-center gap-2">
                                <Target className="h-4 w-4 text-muted-foreground" />
                                Free Delivery Threshold
                            </Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₹</span>
                                <Input
                                    id="threshold"
                                    type="number"
                                    min="0"
                                    value={freeDeliveryThreshold}
                                    onChange={(e) => setFreeDeliveryThreshold(Number(e.target.value))}
                                    className="pl-8 h-10 text-sm"
                                    placeholder="500"
                                    disabled={!isEnabled}
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Orders above this amount get free delivery
                            </p>
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="p-4 bg-muted rounded-lg border-2 border-dashed border-border">
                        <p className="text-sm font-medium mb-2">Preview:</p>
                        {isEnabled ? (
                            <p className="text-xs text-muted-foreground">
                                Orders below ₹{freeDeliveryThreshold} will be charged ₹{deliveryFee} for delivery.
                                <br />
                                Orders of ₹{freeDeliveryThreshold} or above get <span className="text-primary font-semibold">free delivery</span>.
                            </p>
                        ) : (
                            <p className="text-xs text-muted-foreground">
                                All orders get <span className="text-primary font-semibold">free delivery</span> (delivery charges disabled).
                            </p>
                        )}
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end pt-2">
                        <Button
                            onClick={handleSave}
                            disabled={updateMutation.isPending}
                            className="h-10 text-sm border-2"
                        >
                            <Save className="mr-2 h-4 w-4" />
                            {updateMutation.isPending ? 'Saving...' : 'Save Settings'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
