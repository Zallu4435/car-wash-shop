'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

interface Poster {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link?: string;
  ctaText?: string;
}

interface PosterSectionProps {
  posters: Poster[];
  layout?: 'grid' | 'row';
}

export function PosterSection({ posters, layout = 'grid' }: PosterSectionProps) {
  if (posters.length === 0) return null;

  return (
    <div
      className={
        layout === 'grid'
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8'
          : 'flex gap-4 sm:gap-6 md:gap-8 overflow-x-auto pb-4 scrollbar-thin'
      }
    >
      {posters.map((poster) => (
        <Card
          key={poster.id}
          className={`group hover:shadow-lg transition-all duration-300 overflow-hidden border border-border hover:border-primary bg-card ${
            layout === 'row' ? 'flex-shrink-0 w-[280px] sm:w-[300px] md:w-80' : ''
          }`}
        >
          <CardContent className="p-0">
            {/* Image Container */}
            <div className="relative h-40 sm:h-48 md:h-52 bg-muted overflow-hidden">
              {poster.imageUrl ? (
                <Image
                  src={poster.imageUrl}
                  alt={poster.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-gradient-to-br from-primary/10 to-accent/10">
                  <span className="text-4xl sm:text-5xl group-hover:scale-110 transition-transform duration-300">
                    🎉
                  </span>
                </div>
              )}
            </div>
            
            {/* Content */}
            <div className="p-4 sm:p-5">
              <h3 className="font-semibold text-sm sm:text-base md:text-lg mb-1.5 sm:mb-2 text-foreground line-clamp-2 leading-tight">
                {poster.title}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 leading-relaxed line-clamp-2">
                {poster.description}
              </p>
              
              {poster.link && poster.ctaText && (
                <Button 
                  asChild 
                  variant="outline"
                  size="sm"
                  className="w-full group/btn h-8 sm:h-9"
                >
                  <Link href={poster.link} className="flex items-center justify-center gap-1.5 sm:gap-2">
                    <span className="text-xs sm:text-sm">{poster.ctaText}</span>
                    <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
