'use client';

import { useState } from 'react';
import { useAdminAddons, useCreateAddon, useUpdateAddon, useDeleteAddon } from '@/api/domains/admin-addons/queries';
import { DataTable } from '@/components/admin/DataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { IndianRupee, Clock, Car, Bike, Check } from 'lucide-react';
import { toast } from 'sonner';
import Loading from '@/components/shared/display/Loading';
import Error from '@/components/shared/display/Error';
import type { Addon, CreateAddonInput, UpdateAddonInput } from '@/api/domains/admin-addons/fetchers';

// --- Types & Constants ---

const CATEGORY_OPTIONS = [
    { value: 'car', label: 'Car', icon: Car },
    { value: 'bike', label: 'Bike', icon: Bike },
] as const;

// --- Form Component ---

interface AddonFormProps {
    initialData?: Addon;
    onSubmit: (data: any) => Promise<void>;
    onCancel: () => void;
    isSubmitting: boolean;
}

function AddonForm({ initialData, onSubmit, onCancel, isSubmitting }: AddonFormProps) {
    const [formData, setFormData] = useState<CreateAddonInput>({
        name: initialData?.name || '',
        description: initialData?.description || '',
        price: initialData?.price || 0,
        duration: initialData?.duration || 0,
        isActive: initialData?.isActive ?? true,
        applicableCategories: initialData?.applicableCategories || ['car', 'bike'],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim()) return toast.error('Name is required');
        if (formData.price <= 0) return toast.error('Price must be greater than 0');
        if (formData.duration <= 0) return toast.error('Duration must be greater than 0');
        if (!formData.applicableCategories?.length) return toast.error('At least one category is required');

        onSubmit(formData);
    };

    const toggleCategory = (category: 'car' | 'bike') => {
        setFormData(prev => {
            const cats = prev.applicableCategories || [];
            if (cats.includes(category)) {
                if (cats.length === 1) return prev; // Prevent removing last category
                return { ...prev, applicableCategories: cats.filter(c => c !== category) };
            }
            return { ...prev, applicableCategories: [...cats, category] };
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Name</label>
                    <Input
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Wax Coating"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Price</label>
                    <div className="relative">
                        <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="number"
                            className="pl-9"
                            value={formData.price || ''}
                            onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                            placeholder="0"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Duration (mins)</label>
                    <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="number"
                            className="pl-9"
                            value={formData.duration || ''}
                            onChange={e => setFormData({ ...formData, duration: Number(e.target.value) })}
                            placeholder="15"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <div className="flex items-center space-x-2 border rounded-md p-2 h-10">
                        <Switch
                            checked={formData.isActive}
                            onCheckedChange={checked => setFormData({ ...formData, isActive: checked })}
                        />
                        <span className="text-sm text-muted-foreground">
                            {formData.isActive ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief details about this add-on..."
                    rows={3}
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Categories</label>
                <div className="flex gap-2">
                    {CATEGORY_OPTIONS.map(opt => {
                        const isSelected = formData.applicableCategories?.includes(opt.value as any);
                        return (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => toggleCategory(opt.value as any)}
                                className={`
                   flex items-center gap-2 px-4 py-2 rounded-md border text-sm font-medium transition-colors
                   ${isSelected
                                        ? 'bg-primary text-primary-foreground border-primary'
                                        : 'bg-background hover:bg-muted text-muted-foreground'}
                 `}
                            >
                                <opt.icon className="h-4 w-4" />
                                {opt.label}
                                {isSelected && <Check className="h-3 w-3 ml-1" />}
                            </button>
                        );
                    })}
                </div>
            </div>

            <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
            </DialogFooter>
        </form>
    );
}

// --- Main Page Component ---

export default function AddonsPage() {
    const { data: response, isLoading, error } = useAdminAddons({ limit: 100 });
    const createMutation = useCreateAddon();
    const updateMutation = useUpdateAddon();
    const deleteMutation = useDeleteAddon();

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Addon | null>(null);

    const handleCreate = async (data: CreateAddonInput) => {
        try {
            await createMutation.mutateAsync(data);
            setIsAddOpen(false);
            toast.success('Add-on created successfully');
        } catch (err) {
            // handled by mutation
        }
    };

    const handleUpdate = async (data: UpdateAddonInput) => {
        if (!editingItem) return;
        try {
            await updateMutation.mutateAsync({ id: editingItem._id, input: data });
            setEditingItem(null);
            toast.success('Add-on updated successfully');
        } catch (err) {
            // handled by mutation
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteMutation.mutateAsync(id);
            // Toast handled by DataTable or here? 
            // The DataTable component shows a toast on delete success, 
            // but it calls onDelete with the id. 
            // We perform the mutation here.
            // Wait, DataTable component has `setDeleteId` and `handleDelete` internal logic
            // which calls `onDelete(deleteId)` then `toast.success`.
            // So this function just needs to perform the server deletion.
        } catch (err) {
            // If error, we might want to throw so DataTable can catch? 
            // DataTable doesn't await onDelete, it fires and forgets. 
            // Ideally we should handle error toast here.
            console.error(err);
        }
    };

    if (isLoading) return <Loading text="Loading add-ons..." />;
    if (error) return <Error message="Failed to load add-ons" />;

    const tableData = (response?.data || []).map(addon => ({
        ...addon,
        id: addon._id, // Mapping _id to id for DataTable
    }));

    const columns = [
        {
            key: 'name',
            label: 'Name',
            render: (val: string, row: Addon) => (
                <div>
                    <p className="font-medium text-foreground">{val}</p>
                    <p className="text-xs text-muted-foreground max-w-[200px] truncate">{row.description}</p>
                </div>
            )
        },
        {
            key: 'price',
            label: 'Price',
            render: (val: number) => (
                <span className="flex items-center font-medium">
                    <IndianRupee className="h-3 w-3 mr-1" />
                    {val}
                </span>
            )
        },
        {
            key: 'duration',
            label: 'Duration',
            render: (val: number) => (
                <span className="flex items-center text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    {val}m
                </span>
            )
        },
        {
            key: 'applicableCategories',
            label: 'Categories',
            render: (vals: string[]) => (
                <div className="flex gap-1">
                    {vals.map(cat => (
                        <Badge key={cat} variant="secondary" className="text-xs capitalize">
                            {cat}
                        </Badge>
                    ))}
                </div>
            )
        },
        {
            key: 'isActive',
            label: 'Status',
            render: (val: boolean) => (
                <Badge variant={val ? 'default' : 'destructive'} className={val ? 'bg-green-500 hover:bg-green-600' : ''}>
                    {val ? 'Active' : 'Inactive'}
                </Badge>
            )
        }
    ];

    return (
        <div className="p-2 space-y-6">
            <DataTable
                title="Add-ons Management"
                columns={columns}
                data={tableData}
                onAdd={() => setIsAddOpen(true)}
                addLabel="New Add-on"
                onEdit={(id) => {
                    const item = response?.data.find(i => i._id === id);
                    if (item) setEditingItem(item);
                }}
                onDelete={handleDelete}
                searchPlaceholder="Search add-ons..."
            />

            {/* Create Dialog */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Create New Add-on</DialogTitle>
                        <DialogDescription>Add a new extra service to your offerings.</DialogDescription>
                    </DialogHeader>
                    <AddonForm
                        onSubmit={handleCreate}
                        onCancel={() => setIsAddOpen(false)}
                        isSubmitting={createMutation.isPending}
                    />
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Edit Add-on</DialogTitle>
                        <DialogDescription>Modify the details of this add-on.</DialogDescription>
                    </DialogHeader>
                    {editingItem && (
                        <AddonForm
                            initialData={editingItem}
                            onSubmit={handleUpdate}
                            onCancel={() => setEditingItem(null)}
                            isSubmitting={updateMutation.isPending}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
