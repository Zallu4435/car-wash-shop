'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, FileQuestion, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/shared/display/EmptyState';
import { useFAQCategories, useFAQs } from '@/api/domains/faq/queries';
import Loading from '@/components/shared/display/Loading';
import Error from '@/components/shared/display/Error';
import { CustomerRoutes } from '@/lib/constants/routes';

export default function FAQPage() {
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch data from API
  const { data: categories, isLoading: categoriesLoading, error: categoriesError, refetch: refetchCategories } = useFAQCategories();
  const { data: faqs, isLoading: faqsLoading, error: faqsError, refetch: refetchFAQs } = useFAQs();

  // Loading state
  if (categoriesLoading || faqsLoading) {
    return <Loading text="Loading FAQs..." />;
  }

  // Error state
  if (categoriesError || faqsError) {
    return <Error message="Failed to load FAQs" onRetry={() => {
      refetchCategories();
      refetchFAQs();
    }} />;
  }

  // Group FAQs by category
  const faqCategories = useMemo(() => {
    if (!categories || !faqs) return [];
    
    return categories.map(category => ({
      ...category,
      questions: faqs
        .filter(faq => faq.categoryId === category.id)
        .map(faq => ({
          question: faq.question,
          answer: faq.answer,
        })),
    }));
  }, [categories, faqs]);

  const toggleItem = (categoryId: string, questionIndex: number) => {
    const itemId = `${categoryId}-${questionIndex}`;
    setExpandedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  // Filter FAQs based on search
  const filteredCategories = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(
      q =>
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(category => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-background pb-32 lg:pb-8">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary/5 to-background border-b border-border">
        <div className="container-custom py-6 sm:py-8">
          <Link href={CustomerRoutes.SUPPORT}>
            <Button variant="ghost" className="mb-3 sm:mb-4 hover:bg-muted h-9 sm:h-10">
              <ArrowLeft className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm">Back to Support</span>
            </Button>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 sm:p-3 bg-primary/10 rounded-lg sm:rounded-xl flex-shrink-0">
              <FileQuestion className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground truncate">
                Frequently Asked Questions
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1 truncate">
                Find quick answers to common questions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Search Bar */}
      <section className="py-4 sm:py-6 border-b border-border bg-muted/30">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for answers..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10 h-11 sm:h-12 text-sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-6 sm:py-8 lg:py-12">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            {filteredCategories.length === 0 ? (
              <Card className="border-2">
                <CardContent>
                  <EmptyState
                    icon={FileQuestion}
                    title="No Results Found"
                    description="Try different keywords or contact our support team"
                    action={
                      <Button asChild variant="outline" className="border-2">
                        <Link href={CustomerRoutes.SUPPORT}>Contact Support</Link>
                      </Button>
                    }
                  />
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6 sm:space-y-8">
                {filteredCategories.map((category) => (
                  <div key={category.id}>
                    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg flex-shrink-0">
                        <span className="text-xl sm:text-2xl">{category.icon}</span>
                      </div>
                      <h2 className="text-base sm:text-lg md:text-xl font-bold text-foreground flex-1 truncate">
                        {category.name}
                      </h2>
                      <Badge variant="secondary" className="text-xs sm:text-sm flex-shrink-0">
                        {category.questions.length}
                      </Badge>
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                      {category.questions.map((faq, index) => {
                        const itemId = `${category.id}-${index}`;
                        const isExpanded = expandedItems.includes(itemId);

                        return (
                          <Card
                            key={index}
                            className="border-2 hover:border-primary/50 transition-all cursor-pointer"
                            onClick={() => toggleItem(category.id, index)}
                          >
                            <CardContent className="p-3 sm:p-4 md:p-5">
                              <div className="flex items-start justify-between gap-2 sm:gap-3">
                                <h3 className="text-xs sm:text-sm md:text-base font-semibold text-foreground flex-1">
                                  {faq.question}
                                </h3>
                                <button
                                  className="p-0.5 sm:p-1 hover:bg-muted rounded-lg transition-colors flex-shrink-0"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleItem(category.id, index);
                                  }}
                                >
                                  {isExpanded ? (
                                    <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                                  )}
                                </button>
                              </div>

                              {isExpanded && (
                                <div className="mt-2 sm:mt-3 md:mt-4 pt-2 sm:pt-3 md:pt-4 border-t border-border">
                                  <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground leading-relaxed">
                                    {faq.answer}
                                  </p>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Still Need Help */}
            <Card className="border-2 border-primary/20 bg-primary/5 mt-8 sm:mt-12">
              <CardContent className="p-4 sm:p-6">
                <div className="text-center space-y-3 sm:space-y-4">
                  <h3 className="text-base sm:text-lg font-semibold text-foreground">
                    Still need help?
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Can't find what you're looking for? Our support team is here to help!
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
                    <Button asChild className="shadow-lg border-2 h-9 sm:h-10">
                      <Link href={CustomerRoutes.SUPPORT}>Contact Support</Link>
                    </Button>
                    <Button asChild variant="outline" className="border-2 h-9 sm:h-10">
                      <Link href={CustomerRoutes.COMPLAINTS}>Submit Complaint</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
