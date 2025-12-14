'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import {
    Plus,
    Edit2,
    Trash2,
    Save,
    X,
    AlertTriangle,
    ChevronDown,
    ChevronRight,
} from 'lucide-react';
import { toast } from 'sonner';
import {
    useAdminVehicleCategories,
    useAdminVehicleTypes,
    useCreateVehicleCategory,
    useUpdateVehicleCategory,
    useDeleteVehicleCategory,
    useCreateVehicleType,
    useUpdateVehicleType,
    useDeleteVehicleType,
} from '@/api/domains/admin-vehicle-types/queries';
import type { VehicleCategory, VehicleType, VehicleCategoryInput, VehicleTypeInput } from '@/api/domains/admin-vehicle-types/fetchers';
import Loading from '@/components/shared/display/Loading';
import Error from '@/components/shared/display/Error';
import { useConfirmation } from '@/hooks/useConfirmation';

export default function VehicleTypesPage() {
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
    const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
    const [addingCategory, setAddingCategory] = useState(false);
    const [addingTypeForCategory, setAddingTypeForCategory] = useState<string | null>(null);
    const [editingTypeId, setEditingTypeId] = useState<string | null>(null);

    const { data: categories, isLoading: loadingCategories, error: categoriesError, refetch } = useAdminVehicleCategories();
    const { data: allTypes, isLoading: loadingTypes } = useAdminVehicleTypes();

    const createCategoryMutation = useCreateVehicleCategory();
    const updateCategoryMutation = useUpdateVehicleCategory();
    const deleteCategoryMutation = useDeleteVehicleCategory();
    const createTypeMutation = useCreateVehicleType();
    const updateTypeMutation = useUpdateVehicleType();
    const deleteTypeMutation = useDeleteVehicleType();

    const { confirm, ConfirmDialog } = useConfirmation();

    // New category form state
    const [newCategory, setNewCategory] = useState<VehicleCategoryInput>({ name: '', icon: '🚗' });

    // Edit category state
    const [editCategory, setEditCategory] = useState<Partial<VehicleCategoryInput>>({});

    // New type form state
    const [newType, setNewType] = useState<Partial<VehicleTypeInput>>({ name: '', icon: '' });

    // Edit type state
    const [editType, setEditType] = useState<Partial<VehicleTypeInput>>({});

    const getTypesForCategory = (slug: string) => {
        return allTypes?.filter(t => t.category === slug) || [];
    };

    const handleCreateCategory = async () => {
        if (!newCategory.name.trim()) {
            toast.error('Category name is required');
            return;
        }
        try {
            await createCategoryMutation.mutateAsync({
                ...newCategory,
                slug: newCategory.name.toLowerCase().replace(/\s+/g, '-'),
            });
            setNewCategory({ name: '', icon: '🚗' });
            setAddingCategory(false);
            toast.success('Category created');
        } catch (err: any) {
            toast.error(err?.message || 'Failed to create category');
        }
    };

    const handleUpdateCategory = async (id: string) => {
        try {
            await updateCategoryMutation.mutateAsync({ id, data: editCategory });
            setEditingCategoryId(null);
            toast.success('Category updated');
        } catch (err: any) {
            toast.error(err?.message || 'Failed to update category');
        }
    };

    const handleDeleteCategory = async (category: VehicleCategory) => {
        const typeCount = getTypesForCategory(category.slug).length;
        const confirmed = await confirm({
            title: 'Delete Category',
            description: typeCount > 0
                ? `This will delete "${category.name}" and its ${typeCount} type(s). This action cannot be undone.`
                : `Delete category "${category.name}"?`,
            type: 'delete',
            confirmText: 'Delete',
        });
        if (!confirmed) return;

        try {
            await deleteCategoryMutation.mutateAsync(category._id);
            toast.success('Category deleted');
        } catch (err: any) {
            toast.error(err?.message || 'Failed to delete category');
        }
    };

    const handleCreateType = async (categorySlug: string) => {
        if (!newType.name?.trim()) {
            toast.error('Type name is required');
            return;
        }
        try {
            await createTypeMutation.mutateAsync({
                category: categorySlug,
                bodyType: newType.name!.toLowerCase().replace(/\s+/g, '-'),
                name: newType.name!,
                icon: newType.icon || '',
            });
            setNewType({ name: '', icon: '' });
            setAddingTypeForCategory(null);
            toast.success('Type created');
        } catch (err: any) {
            toast.error(err?.message || 'Failed to create type');
        }
    };

    const handleUpdateType = async (id: string) => {
        try {
            await updateTypeMutation.mutateAsync({ id, data: editType });
            setEditingTypeId(null);
            toast.success('Type updated');
        } catch (err: any) {
            toast.error(err?.message || 'Failed to update type');
        }
    };

    const handleDeleteType = async (type: VehicleType) => {
        const confirmed = await confirm({
            title: 'Delete Type',
            description: `Delete "${type.name}"? This may affect service pricing.`,
            type: 'delete',
            confirmText: 'Delete',
        });
        if (!confirmed) return;

        try {
            await deleteTypeMutation.mutateAsync(type._id);
            toast.success('Type deleted');
        } catch (err: any) {
            toast.error(err?.message || 'Failed to delete type');
        }
    };

    if (loadingCategories || loadingTypes) {
        return <Loading text="Loading vehicle types..." />;
    }

    if (categoriesError) {
        return <Error message="Failed to load vehicle types" onRetry={refetch} />;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Vehicle Types</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Manage vehicle categories and subtypes
                    </p>
                </div>
                <Button onClick={() => setAddingCategory(true)} disabled={addingCategory}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Category
                </Button>
            </div>

            {/* Add Category Form */}
            {addingCategory && (
                <Card className="border-2 border-primary/50">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <Input
                                value={newCategory.icon}
                                onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
                                className="w-16 text-center text-lg"
                                placeholder="🚗"
                            />
                            <Input
                                value={newCategory.name}
                                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                                placeholder="Category name (e.g. Car, Bike, Truck)"
                                className="flex-1"
                                autoFocus
                            />
                            <Button onClick={handleCreateCategory} disabled={createCategoryMutation.isPending}>
                                <Save className="h-4 w-4 mr-2" />
                                {createCategoryMutation.isPending ? 'Saving...' : 'Save'}
                            </Button>
                            <Button variant="ghost" onClick={() => { setAddingCategory(false); setNewCategory({ name: '', icon: '🚗' }); }}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Categories List */}
            <div className="space-y-4">
                {categories?.length === 0 && !addingCategory && (
                    <Card className="border-2 border-dashed">
                        <CardContent className="py-12 text-center text-muted-foreground">
                            <p>No vehicle categories yet.</p>
                            <Button variant="link" onClick={() => setAddingCategory(true)}>
                                Add your first category
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {categories?.map((category) => {
                    const types = getTypesForCategory(category.slug);
                    const isExpanded = expandedCategory === category._id;
                    const isEditing = editingCategoryId === category._id;

                    return (
                        <Card key={category._id} className="border-2">
                            <CardHeader className="pb-3">
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setExpandedCategory(isExpanded ? null : category._id)}
                                        className="p-1 hover:bg-muted rounded transition-colors"
                                    >
                                        {isExpanded ? (
                                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                                        ) : (
                                            <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                        )}
                                    </button>

                                    {isEditing ? (
                                        <>
                                            <Input
                                                value={editCategory.icon ?? category.icon}
                                                onChange={(e) => setEditCategory({ ...editCategory, icon: e.target.value })}
                                                className="w-16 text-center text-lg"
                                            />
                                            <Input
                                                value={editCategory.name ?? category.name}
                                                onChange={(e) => setEditCategory({ ...editCategory, name: e.target.value })}
                                                className="flex-1"
                                            />
                                            <Switch
                                                checked={editCategory.isActive ?? category.isActive}
                                                onCheckedChange={(checked) => setEditCategory({ ...editCategory, isActive: checked })}
                                            />
                                            <Button size="sm" onClick={() => handleUpdateCategory(category._id)}>
                                                <Save className="h-4 w-4" />
                                            </Button>
                                            <Button size="sm" variant="ghost" onClick={() => setEditingCategoryId(null)}>
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <span className="text-2xl">{category.icon}</span>
                                            <div className="flex-1">
                                                <CardTitle className="text-lg flex items-center gap-2">
                                                    {category.name}
                                                    {!category.isActive && (
                                                        <Badge variant="secondary">Hidden</Badge>
                                                    )}
                                                </CardTitle>
                                                <CardDescription>
                                                    {types.length} type{types.length !== 1 ? 's' : ''}
                                                </CardDescription>
                                            </div>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => { setEditingCategoryId(category._id); setEditCategory({}); }}
                                            >
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="text-destructive"
                                                onClick={() => handleDeleteCategory(category)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </CardHeader>

                            {isExpanded && (
                                <>
                                    <Separator />
                                    <CardContent className="pt-4">
                                        <div className="space-y-3">
                                            {types.map((type) => {
                                                const isEditingType = editingTypeId === type._id;

                                                return (
                                                    <div
                                                        key={type._id}
                                                        className={`flex items-center gap-3 p-3 rounded-lg border ${type.isActive ? 'bg-background' : 'bg-muted/30 opacity-60'}`}
                                                    >
                                                        {isEditingType ? (
                                                            <>
                                                                <Input
                                                                    value={editType.icon ?? type.icon}
                                                                    onChange={(e) => setEditType({ ...editType, icon: e.target.value })}
                                                                    className="w-14 text-center"
                                                                />
                                                                <Input
                                                                    value={editType.name ?? type.name}
                                                                    onChange={(e) => setEditType({ ...editType, name: e.target.value })}
                                                                    className="flex-1"
                                                                />
                                                                <Switch
                                                                    checked={editType.isActive ?? type.isActive}
                                                                    onCheckedChange={(checked) => setEditType({ ...editType, isActive: checked })}
                                                                />
                                                                <Button size="sm" onClick={() => handleUpdateType(type._id)}>
                                                                    <Save className="h-4 w-4" />
                                                                </Button>
                                                                <Button size="sm" variant="ghost" onClick={() => setEditingTypeId(null)}>
                                                                    <X className="h-4 w-4" />
                                                                </Button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <span className="text-xl w-8 text-center">{type.icon || '•'}</span>
                                                                <div className="flex-1">
                                                                    <p className="font-medium">{type.name}</p>
                                                                    <p className="text-xs text-muted-foreground font-mono">{type.bodyType}</p>
                                                                </div>
                                                                <Badge variant={type.isActive ? 'default' : 'secondary'}>
                                                                    {type.isActive ? 'Active' : 'Hidden'}
                                                                </Badge>
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    onClick={() => { setEditingTypeId(type._id); setEditType({}); }}
                                                                >
                                                                    <Edit2 className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    className="text-destructive"
                                                                    onClick={() => handleDeleteType(type)}
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </>
                                                        )}
                                                    </div>
                                                );
                                            })}

                                            {/* Add Type Form */}
                                            {addingTypeForCategory === category._id ? (
                                                <div className="flex items-center gap-3 p-3 rounded-lg border border-dashed border-primary/50">
                                                    <Input
                                                        value={newType.icon || ''}
                                                        onChange={(e) => setNewType({ ...newType, icon: e.target.value })}
                                                        className="w-14 text-center"
                                                        placeholder="🔹"
                                                    />
                                                    <Input
                                                        value={newType.name || ''}
                                                        onChange={(e) => setNewType({ ...newType, name: e.target.value })}
                                                        placeholder="Type name (e.g. Sedan, SUV)"
                                                        className="flex-1"
                                                        autoFocus
                                                    />
                                                    <Button size="sm" onClick={() => handleCreateType(category.slug)}>
                                                        <Save className="h-4 w-4 mr-1" />
                                                        Add
                                                    </Button>
                                                    <Button size="sm" variant="ghost" onClick={() => { setAddingTypeForCategory(null); setNewType({ name: '', icon: '' }); }}>
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <Button
                                                    variant="outline"
                                                    className="w-full border-dashed"
                                                    onClick={() => setAddingTypeForCategory(category._id)}
                                                >
                                                    <Plus className="h-4 w-4 mr-2" />
                                                    Add Type
                                                </Button>
                                            )}
                                        </div>
                                    </CardContent>
                                </>
                            )}
                        </Card>
                    );
                })}
            </div>

            <ConfirmDialog />
        </div>
    );
}
