'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Phone,
    Mail,
    MapPin,
    Building,
    FileText,
    Facebook,
    Instagram,
    Twitter,
    Linkedin,
    Globe,
    Edit2,
    ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';
import {
    usePlatformContact,
    useUpdatePlatformContact,
    useCompanyDetails,
    useUpdateCompanyDetails,
} from '@/api/domains/admin-contacts/queries';
import type { PlatformContact, CompanyDetails } from '@/api/domains/admin-contacts/fetchers';
import Loading from '@/components/shared/display/Loading';
import Error from '@/components/shared/display/Error';

const defaultPlatformContact: PlatformContact = {
    phone: '',
    email: '',
    location: '',
    description: '',
    socialLinks: { facebook: '', instagram: '', twitter: '', linkedin: '' },
};

const defaultCompanyDetails: CompanyDetails = {
    companyName: '',
    address: '',
    city: '',
    phone: '',
    email: '',
    gst: '',
    website: '',
};

export default function ContactManagementPage() {
    const [activeTab, setActiveTab] = useState('general');

    // API hooks
    const { data: platformContact, isLoading: isLoadingPlatform, error: platformError, refetch: refetchPlatform } = usePlatformContact();
    const { data: companyDetails, isLoading: isLoadingCompany, error: companyError, refetch: refetchCompany } = useCompanyDetails();
    const updatePlatformMutation = useUpdatePlatformContact();
    const updateCompanyMutation = useUpdateCompanyDetails();

    // Edit states
    const [isFooterEditing, setIsFooterEditing] = useState(false);
    const [isInvoiceEditing, setIsInvoiceEditing] = useState(false);

    // Temporary state for edits
    const [tempFooterData, setTempFooterData] = useState<PlatformContact>(defaultPlatformContact);
    const [tempInvoiceData, setTempInvoiceData] = useState<CompanyDetails>(defaultCompanyDetails);

    // Sync temp data when API data loads
    useEffect(() => {
        if (platformContact) {
            setTempFooterData(platformContact);
        }
    }, [platformContact]);

    useEffect(() => {
        if (companyDetails) {
            setTempInvoiceData(companyDetails);
        }
    }, [companyDetails]);

    const footerData = platformContact || defaultPlatformContact;
    const invoiceData = companyDetails || defaultCompanyDetails;

    const startFooterEdit = () => {
        setTempFooterData({ ...footerData });
        setIsFooterEditing(true);
    };

    const cancelFooterEdit = () => {
        setIsFooterEditing(false);
        setTempFooterData({ ...footerData });
    };

    const startInvoiceEdit = () => {
        setTempInvoiceData({ ...invoiceData });
        setIsInvoiceEditing(true);
    };

    const cancelInvoiceEdit = () => {
        setIsInvoiceEditing(false);
        setTempInvoiceData({ ...invoiceData });
    };

    const handleFooterChange = (field: string, value: string) => {
        if (field.startsWith('socialLinks.')) {
            const socialField = field.split('.')[1] as keyof PlatformContact['socialLinks'];
            setTempFooterData(prev => ({
                ...prev,
                socialLinks: {
                    ...prev.socialLinks,
                    [socialField]: value,
                },
            }));
        } else {
            setTempFooterData(prev => ({ ...prev, [field]: value }));
        }
    };

    const handleInvoiceChange = (field: string, value: string) => {
        setTempInvoiceData(prev => ({ ...prev, [field]: value }));
    };

    const saveFooter = async () => {
        try {
            await updatePlatformMutation.mutateAsync(tempFooterData);
            setIsFooterEditing(false);
            toast.success('Platform contact settings updated');
        } catch {
            toast.error('Failed to update platform contact');
        }
    };

    const saveInvoice = async () => {
        try {
            await updateCompanyMutation.mutateAsync(tempInvoiceData);
            setIsInvoiceEditing(false);
            toast.success('Invoice details updated');
        } catch {
            toast.error('Failed to update company details');
        }
    };

    const isSaving = updatePlatformMutation.isPending || updateCompanyMutation.isPending;

    if (isLoadingPlatform || isLoadingCompany) {
        return <Loading text="Loading contact settings..." />;
    }

    if (platformError || companyError) {
        return (
            <Error
                message="Failed to load contact settings"
                details={(platformError as any)?.message || (companyError as any)?.message}
                onRetry={() => {
                    refetchPlatform();
                    refetchCompany();
                }}
            />
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-6">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Contact Settings</h1>
                <p className="text-muted-foreground">
                    Manage how your contact information appears across the website and invoices.
                </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                    <TabsTrigger value="general">Platform & Footer</TabsTrigger>
                    <TabsTrigger value="invoice">Billing & Invoice</TabsTrigger>
                </TabsList>

                {/* --- General Tab --- */}
                <TabsContent value="general" className="space-y-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                            <div className="space-y-1">
                                <CardTitle>Footer Information</CardTitle>
                                <CardDescription>
                                    Contact details displayed in the website footer.
                                </CardDescription>
                            </div>
                            {!isFooterEditing && (
                                <Button onClick={startFooterEdit} variant="outline" size="sm">
                                    <Edit2 className="h-4 w-4 mr-2" />
                                    Edit Details
                                </Button>
                            )}
                        </CardHeader>
                        <Separator />
                        <CardContent className="pt-6">
                            {isFooterEditing ? (
                                <div className="space-y-6 animate-in fade-in duration-300">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label>Phone Number</Label>
                                            <Input
                                                value={tempFooterData.phone}
                                                onChange={(e) => handleFooterChange('phone', e.target.value)}
                                                placeholder="+91..."
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Email Address</Label>
                                            <Input
                                                value={tempFooterData.email}
                                                onChange={(e) => handleFooterChange('email', e.target.value)}
                                                placeholder="support@..."
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Location</Label>
                                        <Input
                                            value={tempFooterData.location}
                                            onChange={(e) => handleFooterChange('location', e.target.value)}
                                            placeholder="City, State"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>About Description</Label>
                                        <Textarea
                                            value={tempFooterData.description}
                                            onChange={(e) => handleFooterChange('description', e.target.value)}
                                            rows={3}
                                            className="resize-none"
                                        />
                                        <p className="text-sm text-muted-foreground text-right w-full">
                                            {tempFooterData.description.length} characters
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="text-sm font-medium">Social Media Links</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="flex items-center gap-2">
                                                <Facebook className="h-4 w-4 text-blue-600 shrink-0" />
                                                <Input
                                                    value={tempFooterData.socialLinks.facebook}
                                                    onChange={(e) => handleFooterChange('socialLinks.facebook', e.target.value)}
                                                    placeholder="Facebook URL"
                                                    className="h-9"
                                                />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Instagram className="h-4 w-4 text-pink-600 shrink-0" />
                                                <Input
                                                    value={tempFooterData.socialLinks.instagram}
                                                    onChange={(e) => handleFooterChange('socialLinks.instagram', e.target.value)}
                                                    placeholder="Instagram URL"
                                                    className="h-9"
                                                />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Twitter className="h-4 w-4 text-sky-500 shrink-0" />
                                                <Input
                                                    value={tempFooterData.socialLinks.twitter}
                                                    onChange={(e) => handleFooterChange('socialLinks.twitter', e.target.value)}
                                                    placeholder="Twitter URL"
                                                    className="h-9"
                                                />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Linkedin className="h-4 w-4 text-blue-700 shrink-0" />
                                                <Input
                                                    value={tempFooterData.socialLinks.linkedin}
                                                    onChange={(e) => handleFooterChange('socialLinks.linkedin', e.target.value)}
                                                    placeholder="LinkedIn URL"
                                                    className="h-9"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-8 animate-in fade-in duration-300">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="flex gap-3">
                                            <div className="p-2 bg-primary/10 rounded-lg h-fit">
                                                <Phone className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground">Phone</p>
                                                <p className="text-base font-medium mt-0.5">{footerData.phone || '—'}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <div className="p-2 bg-primary/10 rounded-lg h-fit">
                                                <Mail className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground">Email</p>
                                                <p className="text-base font-medium mt-0.5">{footerData.email || '—'}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <div className="p-2 bg-primary/10 rounded-lg h-fit">
                                                <MapPin className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground">Location</p>
                                                <p className="text-base font-medium mt-0.5">{footerData.location || '—'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-medium text-muted-foreground mb-2">About Description</h4>
                                        <div className="p-4 bg-muted/50 rounded-lg border border-border">
                                            <p className="text-sm leading-relaxed">{footerData.description || 'No description set'}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-medium text-muted-foreground mb-3">Connected Accounts</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {footerData.socialLinks?.facebook && (
                                                <a href={footerData.socialLinks.facebook} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-full text-xs font-medium border border-blue-200 transition-colors dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800">
                                                    <Facebook className="h-3.5 w-3.5" /> Facebook <ExternalLink className="h-3 w-3 opacity-50" />
                                                </a>
                                            )}
                                            {footerData.socialLinks?.instagram && (
                                                <a href={footerData.socialLinks.instagram} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-1.5 bg-pink-50 text-pink-700 hover:bg-pink-100 rounded-full text-xs font-medium border border-pink-200 transition-colors dark:bg-pink-950 dark:text-pink-300 dark:border-pink-800">
                                                    <Instagram className="h-3.5 w-3.5" /> Instagram <ExternalLink className="h-3 w-3 opacity-50" />
                                                </a>
                                            )}
                                            {footerData.socialLinks?.twitter && (
                                                <a href={footerData.socialLinks.twitter} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-1.5 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded-full text-xs font-medium border border-sky-200 transition-colors dark:bg-sky-950 dark:text-sky-300 dark:border-sky-800">
                                                    <Twitter className="h-3.5 w-3.5" /> Twitter <ExternalLink className="h-3 w-3 opacity-50" />
                                                </a>
                                            )}
                                            {footerData.socialLinks?.linkedin && (
                                                <a href={footerData.socialLinks.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-800 hover:bg-blue-100 rounded-full text-xs font-medium border border-blue-200 transition-colors dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800">
                                                    <Linkedin className="h-3.5 w-3.5" /> LinkedIn <ExternalLink className="h-3 w-3 opacity-50" />
                                                </a>
                                            )}
                                            {!Object.values(footerData.socialLinks || {}).some(Boolean) && (
                                                <p className="text-sm text-muted-foreground italic">No social accounts connected</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                        {isFooterEditing && (
                            <CardFooter className="flex justify-end gap-3 bg-muted/20 py-4 border-t">
                                <Button variant="ghost" onClick={cancelFooterEdit} disabled={isSaving}>
                                    Cancel
                                </Button>
                                <Button onClick={saveFooter} disabled={isSaving}>
                                    {isSaving && <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />}
                                    Save Changes
                                </Button>
                            </CardFooter>
                        )}
                    </Card>
                </TabsContent>

                {/* --- Invoice Tab --- */}
                <TabsContent value="invoice" className="space-y-6">
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                        <div className="xl:col-span-2 space-y-6">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                                    <div className="space-y-1">
                                        <CardTitle>Company Details</CardTitle>
                                        <CardDescription>
                                            These details appear on customer invoices.
                                        </CardDescription>
                                    </div>
                                    {!isInvoiceEditing && (
                                        <Button onClick={startInvoiceEdit} variant="outline" size="sm">
                                            <Edit2 className="h-4 w-4 mr-2" />
                                            Edit Details
                                        </Button>
                                    )}
                                </CardHeader>
                                <Separator />
                                <CardContent className="pt-6">
                                    {isInvoiceEditing ? (
                                        <div className="space-y-6 animate-in fade-in duration-300">
                                            <div className="space-y-2">
                                                <Label>Company Name</Label>
                                                <div className="relative">
                                                    <Building className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        className="pl-9"
                                                        value={tempInvoiceData.companyName}
                                                        onChange={(e) => handleInvoiceChange('companyName', e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>Address</Label>
                                                    <Input
                                                        value={tempInvoiceData.address}
                                                        onChange={(e) => handleInvoiceChange('address', e.target.value)}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>City / State</Label>
                                                    <Input
                                                        value={tempInvoiceData.city}
                                                        onChange={(e) => handleInvoiceChange('city', e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>Phone</Label>
                                                    <Input
                                                        value={tempInvoiceData.phone}
                                                        onChange={(e) => handleInvoiceChange('phone', e.target.value)}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Email</Label>
                                                    <Input
                                                        value={tempInvoiceData.email}
                                                        onChange={(e) => handleInvoiceChange('email', e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>GST Number</Label>
                                                    <Input
                                                        value={tempInvoiceData.gst}
                                                        onChange={(e) => handleInvoiceChange('gst', e.target.value)}
                                                        className="font-mono"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Website</Label>
                                                    <Input
                                                        value={tempInvoiceData.website}
                                                        onChange={(e) => handleInvoiceChange('website', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-6 animate-in fade-in duration-300">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                                                <div>
                                                    <p className="text-sm font-medium text-muted-foreground mb-1">Company Name</p>
                                                    <p className="text-base font-medium">{invoiceData.companyName || '—'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-muted-foreground mb-1">GST Number</p>
                                                    <p className="text-base font-mono bg-muted px-2 py-0.5 rounded inline-block">{invoiceData.gst || '—'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-muted-foreground mb-1">Billing Address</p>
                                                    <p className="text-base">{invoiceData.address || '—'}</p>
                                                    <p className="text-base text-muted-foreground">{invoiceData.city || ''}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-muted-foreground mb-1">Contact</p>
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <Phone className="h-4 w-4 text-muted-foreground" />
                                                            <span className="text-sm">{invoiceData.phone || '—'}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Mail className="h-4 w-4 text-muted-foreground" />
                                                            <span className="text-sm">{invoiceData.email || '—'}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Globe className="h-4 w-4 text-muted-foreground" />
                                                            <span className="text-sm">{invoiceData.website || '—'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                                {isInvoiceEditing && (
                                    <CardFooter className="flex justify-end gap-3 bg-muted/20 py-4 border-t">
                                        <Button variant="ghost" onClick={cancelInvoiceEdit} disabled={isSaving}>
                                            Cancel
                                        </Button>
                                        <Button onClick={saveInvoice} disabled={isSaving}>
                                            {isSaving && <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />}
                                            Save Changes
                                        </Button>
                                    </CardFooter>
                                )}
                            </Card>
                        </div>

                        {/* Preview Section */}
                        <div>
                            <div className="sticky top-6">
                                <Card className="border-dashed shadow-sm bg-muted/30">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                                            <FileText className="h-4 w-4" /> Invoice Header Preview
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <div className="bg-white dark:bg-card border-2 border-border p-6 rounded-lg shadow-sm">
                                            <div className="flex justify-between items-start mb-6 border-b pb-6">
                                                <div className="space-y-1">
                                                    <h2 className="text-lg font-bold text-foreground">INVOICE</h2>
                                                    <p className="text-xs text-muted-foreground">#INV-2024-001</p>
                                                </div>
                                                <div className="text-right space-y-1">
                                                    <p className="font-bold text-sm">
                                                        {isInvoiceEditing ? tempInvoiceData.companyName : invoiceData.companyName}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {isInvoiceEditing ? tempInvoiceData.address : invoiceData.address}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {isInvoiceEditing ? tempInvoiceData.city : invoiceData.city}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="space-y-2 text-xs">
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Phone:</span>
                                                    <span>{isInvoiceEditing ? tempInvoiceData.phone : invoiceData.phone}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Email:</span>
                                                    <span>{isInvoiceEditing ? tempInvoiceData.email : invoiceData.email}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">GSTIN:</span>
                                                    <span className="font-mono">{isInvoiceEditing ? tempInvoiceData.gst : invoiceData.gst}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-xs text-muted-foreground text-center mt-4">
                                            This is how your company details will appear on the invoice header.
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
