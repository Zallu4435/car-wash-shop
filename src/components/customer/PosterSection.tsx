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
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
          : 'flex gap-8 overflow-x-auto pb-4 scrollbar-hide'
      }
    >
      {posters.map((poster) => (
        <Card
          key={poster.id}
          className={`group hover:shadow-2xl transition-all duration-300 overflow-hidden border-border ${
            layout === 'row' ? 'flex-shrink-0 w-80' : ''
          }`}
        >
          <CardContent className="p-0">
            <div className="relative h-56 bg-gradient-to-br from-muted to-muted/50 overflow-hidden">
              {poster.imageUrl ? (
                <Image
                  src={poster.imageUrl}
                  alt={poster.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <span className="text-6xl group-hover:scale-110 transition-transform duration-300">🎉</span>
                </div>
              )}
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            
            <div className="p-6">
              <h3 className="font-bold text-xl mb-3 text-foreground group-hover:text-primary transition-colors">
                {poster.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                {poster.description}
              </p>
              {poster.link && poster.ctaText && (
                <Button asChild className="w-full group/btn shadow-md">
                  <Link href={poster.link} className="flex items-center justify-center gap-2">
                    {poster.ctaText}
                    <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
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
