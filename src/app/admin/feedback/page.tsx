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

  const getTypeStyle = (type: string) => {
    switch (type) {
      case 'Compliment':
        return {
          backgroundColor: 'hsl(160 60% 45% / 0.1)',
          color: 'hsl(160 60% 45%)',
          borderColor: 'hsl(160 60% 45% / 0.3)'
        };
      case 'Suggestion':
        return {
          backgroundColor: 'hsl(221 83% 53% / 0.1)',
          color: 'hsl(221 83% 53%)',
          borderColor: 'hsl(221 83% 53% / 0.3)'
        };
      case 'Bug':
        return {
          backgroundColor: 'hsl(0 63% 55% / 0.1)',
          color: 'hsl(0 63% 55%)',
          borderColor: 'hsl(0 63% 55% / 0.3)'
        };
      default:
        return {
          backgroundColor: 'hsl(var(--muted))',
          color: 'hsl(var(--muted-foreground))',
          borderColor: 'hsl(var(--border))'
        };
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
        <Card className="border-2 border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-xl" style={{ backgroundColor: 'hsl(221 83% 53% / 0.1)' }}>
                <MessageSquare className="h-6 w-6" style={{ color: 'hsl(221 83% 53%)' }} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Feedback</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground">{feedback.length}</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-xl" style={{ backgroundColor: 'hsl(43 74% 66% / 0.15)' }}>
                <Star className="h-6 w-6" style={{ color: 'hsl(43 74% 66%)' }} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Rating</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground">{avgRating} ⭐</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-xl" style={{ backgroundColor: 'hsl(160 60% 45% / 0.1)' }}>
                <ThumbsUp className="h-6 w-6" style={{ color: 'hsl(160 60% 45%)' }} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Compliments</p>
              </div>
            </div>
            <p className="text-3xl font-bold" style={{ color: 'hsl(160 60% 45%)' }}>
              {compliments}
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-xl" style={{ backgroundColor: 'hsl(280 65% 60% / 0.1)' }}>
                <Lightbulb className="h-6 w-6" style={{ color: 'hsl(280 65% 60%)' }} />
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
      <Card className="border-2 border-border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg" style={{ backgroundColor: 'hsl(var(--primary) / 0.1)' }}>
              <MessageSquare className="h-5 w-5" style={{ color: 'hsl(var(--primary))' }} />
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
            <div className="text-center py-12 bg-muted/30 rounded-xl border-2 border-dashed border-border">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No feedback found</h3>
              <p className="text-muted-foreground">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredFeedback.map((item) => {
                const typeStyle = getTypeStyle(item.type);
                return (
                  <Card key={item.id} className="border-2 border-border hover:shadow-lg transition-all">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3 flex-wrap gap-3">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: 'hsl(var(--primary) / 0.1)' }}
                          >
                            <Users className="h-5 w-5" style={{ color: 'hsl(var(--primary))' }} />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{item.customer}</p>
                            <p className="text-xs text-muted-foreground">{item.service}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge 
                            variant="outline"
                            style={{
                              backgroundColor: typeStyle.backgroundColor,
                              color: typeStyle.color,
                              borderColor: typeStyle.borderColor
                            }}
                          >
                            <span className="flex items-center gap-1">
                              {getTypeIcon(item.type)}
                              {item.type}
                            </span>
                          </Badge>
                          <span className="text-sm text-muted-foreground">{item.date}</span>
                        </div>
                      </div>

                      <p className="text-sm text-foreground mb-3">{item.message}</p>

                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                              key={i} 
                              className="h-4 w-4"
                              style={{
                                fill: i < item.rating ? 'hsl(43 74% 66%)' : 'transparent',
                                color: i < item.rating ? 'hsl(43 74% 66%)' : 'hsl(var(--muted-foreground) / 0.3)'
                              }}
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
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
