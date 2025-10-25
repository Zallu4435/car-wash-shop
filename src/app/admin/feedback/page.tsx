'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Star, 
  MessageSquare, 
  ThumbsUp, 
  AlertCircle, 
  Lightbulb,
  Search,
  TrendingUp,
  Users
} from 'lucide-react';
import { useState } from 'react';

const feedback = [
  { 
    id: 1, 
    customer: 'John Doe', 
    type: 'Compliment', 
    rating: 5, 
    message: 'Excellent service! The staff was very professional and the car looks brand new.', 
    date: '2025-10-24',
    service: 'Premium Wash'
  },
  { 
    id: 2, 
    customer: 'Priya Sharma', 
    type: 'Suggestion', 
    rating: 4, 
    message: 'Great service overall. Would love to see more eco-friendly product options.', 
    date: '2025-10-23',
    service: 'Interior Detailing'
  },
  { 
    id: 3, 
    customer: 'Amit Patel', 
    type: 'Bug', 
    rating: 3, 
    message: 'Experienced an issue during checkout. Payment went through but did not receive confirmation.', 
    date: '2025-10-22',
    service: 'Full Detailing'
  },
  { 
    id: 4, 
    customer: 'Rahul Kumar', 
    type: 'Compliment', 
    rating: 5, 
    message: 'Amazing experience! Will definitely recommend to friends.', 
    date: '2025-10-21',
    service: 'Express Wash'
  },
];

export default function AdminFeedbackPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');

  const filteredFeedback = feedback.filter(item => {
    const matchesSearch = 
      item.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    const matchesRating = 
      ratingFilter === 'all' ||
      (ratingFilter === '5' && item.rating === 5) ||
      (ratingFilter === '4' && item.rating === 4) ||
      (ratingFilter === '3' && item.rating <= 3);
    return matchesSearch && matchesType && matchesRating;
  });

  const avgRating = (feedback.reduce((sum, item) => sum + item.rating, 0) / feedback.length).toFixed(1);
  const compliments = feedback.filter(f => f.type === 'Compliment').length;
  const suggestions = feedback.filter(f => f.type === 'Suggestion').length;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Compliment':
        return <ThumbsUp className="h-4 w-4" />;
      case 'Suggestion':
        return <Lightbulb className="h-4 w-4" />;
      case 'Bug':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getTypeBadgeClass = (type: string) => {
    switch (type) {
      case 'Compliment':
        return 'bg-green-100 dark:bg-green-950/30 text-green-600 dark:text-green-400';
      case 'Suggestion':
        return 'bg-blue-100 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400';
      case 'Bug':
        return 'bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">Customer Feedback</h1>
        <p className="text-muted-foreground mt-1">Monitor and respond to customer feedback</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-2">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-blue-100 dark:bg-blue-950/30 rounded-xl">
                <MessageSquare className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Feedback</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground">{feedback.length}</p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-950/30 rounded-xl">
                <Star className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Rating</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground">{avgRating} ⭐</p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-green-100 dark:bg-green-950/30 rounded-xl">
                <ThumbsUp className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Compliments</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">{compliments}</p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-purple-100 dark:bg-purple-950/30 rounded-xl">
                <Lightbulb className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Suggestions</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground">{suggestions}</p>
          </CardContent>
        </Card>
      </div>

      {/* Feedback List */}
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
            <CardTitle>Recent Feedback</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search feedback..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Compliment">Compliments</SelectItem>
                <SelectItem value="Suggestion">Suggestions</SelectItem>
                <SelectItem value="Bug">Bug Reports</SelectItem>
              </SelectContent>
            </Select>

            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars & Below</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Feedback Items */}
          {filteredFeedback.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No feedback found</h3>
              <p className="text-muted-foreground">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredFeedback.map((item) => (
                <Card key={item.id} className="border-2 hover:shadow-md transition-all">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{item.customer}</p>
                          <p className="text-xs text-muted-foreground">{item.service}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getTypeBadgeClass(item.type)}>
                          <span className="flex items-center gap-1">
                            {getTypeIcon(item.type)}
                            {item.type}
                          </span>
                        </Badge>
                        <span className="text-sm text-muted-foreground">{item.date}</span>
                      </div>
                    </div>

                    <p className="text-sm text-foreground mb-3">{item.message}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${
                              i < item.rating 
                                ? 'fill-yellow-400 text-yellow-400' 
                                : 'text-gray-300 dark:text-gray-600'
                            }`} 
                          />
                        ))}
                        <span className="text-sm font-semibold text-foreground ml-2">{item.rating}/5</span>
                      </div>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Reply
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
