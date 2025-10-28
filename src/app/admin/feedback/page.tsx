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
        return <ThumbsUp className="h-3.5 w-3.5 sm:h-4 sm:w-4" />;
      case 'Suggestion':
        return <Lightbulb className="h-3.5 w-3.5 sm:h-4 sm:w-4" />;
      case 'Bug':
        return <AlertCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />;
      default:
        return <MessageSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4" />;
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
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
          Customer Feedback
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
          Monitor and respond to customer feedback
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { icon: MessageSquare, color: 'hsl(221 83% 53%)', label: 'Total Feedback', value: feedback.length },
          { icon: Star, color: 'hsl(43 74% 66%)', label: 'Avg Rating', value: `${avgRating} ⭐` },
          { icon: ThumbsUp, color: 'hsl(160 60% 45%)', label: 'Compliments', value: compliments, isHighlight: true },
          { icon: Lightbulb, color: 'hsl(280 65% 60%)', label: 'Suggestions', value: suggestions },
        ].map((stat, index) => (
          <Card key={index} className="border-2 border-border">
            <CardContent className="p-4 sm:p-5 md:p-6">
              <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
                <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl flex-shrink-0" style={{ backgroundColor: `${stat.color} / 0.1` }}>
                  <stat.icon className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: stat.color }} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">{stat.label}</p>
                </div>
              </div>
              <p className={`text-2xl sm:text-3xl font-bold ${stat.isHighlight ? '' : 'text-foreground'}`} style={stat.isHighlight ? { color: stat.color } : {}}>
                {stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Feedback List */}
      <Card className="border-2 border-border">
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 sm:p-2 rounded-lg" style={{ backgroundColor: 'hsl(var(--primary) / 0.1)' }}>
              <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: 'hsl(var(--primary))' }} />
            </div>
            <CardTitle className="text-base sm:text-lg">Recent Feedback</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
              <Input
                placeholder="Search feedback..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 sm:pl-10 h-10 sm:h-11 text-xs sm:text-sm"
              />
            </div>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-48 h-10 sm:h-11 text-xs sm:text-sm">
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
              <SelectTrigger className="w-full md:w-48 h-10 sm:h-11 text-xs sm:text-sm">
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
            <div className="text-center py-10 sm:py-12 bg-muted/30 rounded-lg sm:rounded-xl border-2 border-dashed border-border">
              <MessageSquare className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1.5 sm:mb-2">No feedback found</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="space-y-2.5 sm:space-y-3">
              {filteredFeedback.map((item) => {
                const typeStyle = getTypeStyle(item.type);
                return (
                  <Card key={item.id} className="border-2 border-border hover:shadow-lg transition-all">
                    <CardContent className="p-4 sm:p-5">
                      <div className="flex items-start justify-between mb-2.5 sm:mb-3 flex-wrap gap-2 sm:gap-3">
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                          <div 
                            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: 'hsl(var(--primary) / 0.1)' }}
                          >
                            <Users className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: 'hsl(var(--primary))' }} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-sm sm:text-base text-foreground truncate">{item.customer}</p>
                            <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{item.service}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge 
                            variant="outline"
                            className="text-xs"
                            style={{
                              backgroundColor: typeStyle.backgroundColor,
                              color: typeStyle.color,
                              borderColor: typeStyle.borderColor
                            }}
                          >
                            <span className="flex items-center gap-1">
                              {getTypeIcon(item.type)}
                              <span className="hidden xs:inline">{item.type}</span>
                            </span>
                          </Badge>
                          <span className="text-[10px] sm:text-xs text-muted-foreground">{item.date}</span>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-foreground mb-2.5 sm:mb-3">{item.message}</p>

                      <div className="flex items-center justify-between flex-wrap gap-2 sm:gap-3">
                        <div className="flex items-center gap-0.5 sm:gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                              key={i} 
                              className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                              style={{
                                fill: i < item.rating ? 'hsl(43 74% 66%)' : 'transparent',
                                color: i < item.rating ? 'hsl(43 74% 66%)' : 'hsl(var(--muted-foreground) / 0.3)'
                              }}
                            />
                          ))}
                          <span className="text-xs sm:text-sm font-semibold text-foreground ml-1.5 sm:ml-2">{item.rating}/5</span>
                        </div>
                        <Button variant="outline" size="sm" className="h-8 sm:h-9 text-xs sm:text-sm">
                          <MessageSquare className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          <span className="hidden xs:inline">Reply</span>
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
