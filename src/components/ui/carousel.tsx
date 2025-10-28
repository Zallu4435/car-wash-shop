import * as React from 'react';
import useEmblaCarousel, { type UseEmblaCarouselType } from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Button } from './button';

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

type CarouselProps = {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  setApi?: (api: CarouselApi) => void;
};

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
} & CarouselProps;

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);
  if (!context) {
    throw new Error('useCarousel must be used within a <Carousel />');
  }
  return context;
}

const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(({ opts, setApi, plugins, className, children, ...props }, ref) => {
  const [carouselRef, api] = useEmblaCarousel({ ...opts, loop: true }, plugins);
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  const onSelect = React.useCallback((api: CarouselApi) => {
    if (!api) return;
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  }, []);

  const scrollPrev = React.useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const scrollNext = React.useCallback(() => {
    api?.scrollNext();
  }, [api]);

  React.useEffect(() => {
    if (!api || !setApi) return;
    setApi(api);
  }, [api, setApi]);

  React.useEffect(() => {
    if (!api) return;
    onSelect(api);
    api.on('reInit', onSelect);
    api.on('select', onSelect);

    return () => {
      api?.off('select', onSelect);
    };
  }, [api, onSelect]);

  return (
    <CarouselContext.Provider
      value={{ carouselRef, api, opts, scrollPrev, scrollNext, canScrollPrev, canScrollNext }}
    >
      <div ref={ref} className={cn('relative', className)} {...props}>
        {children}
      </div>
    </CarouselContext.Provider>
  );
});
Carousel.displayName = 'Carousel';

const CarouselContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { carouselRef } = useCarousel();

    return (
      <div ref={carouselRef} className="overflow-hidden">
        <div ref={ref} className={cn('flex', className)} {...props} />
      </div>
    );
  }
);
CarouselContent.displayName = 'CarouselContent';

const CarouselItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="group"
        aria-roledescription="slide"
        className={cn('min-w-0 shrink-0 grow-0 basis-full', className)}
        {...props}
      />
    );
  }
);
CarouselItem.displayName = 'CarouselItem';

const CarouselPrevious = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof Button>>(
  ({ className, variant = 'outline', size = 'icon', ...props }, ref) => {
    const { scrollPrev, canScrollPrev } = useCarousel();

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn(
          'absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10',
          'h-9 w-9 sm:h-10 sm:w-10 rounded-full',
          'bg-background/80 backdrop-blur-sm border border-border',
          'hover:bg-background hover:border-primary hover:text-primary',
          'shadow-md hover:shadow-lg',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'transition-all duration-300',
          className
        )}
        disabled={!canScrollPrev}
        onClick={scrollPrev}
        {...props}
      >
        <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
        <span className="sr-only">Previous slide</span>
      </Button>
    );
  }
);
CarouselPrevious.displayName = 'CarouselPrevious';

const CarouselNext = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof Button>>(
  ({ className, variant = 'outline', size = 'icon', ...props }, ref) => {
    const { scrollNext, canScrollNext } = useCarousel();

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn(
          'absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10',
          'h-9 w-9 sm:h-10 sm:w-10 rounded-full',
          'bg-background/80 backdrop-blur-sm border border-border',
          'hover:bg-background hover:border-primary hover:text-primary',
          'shadow-md hover:shadow-lg',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'transition-all duration-300',
          className
        )}
        disabled={!canScrollNext}
        onClick={scrollNext}
        {...props}
      >
        <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
        <span className="sr-only">Next slide</span>
      </Button>
    );
  }
);
CarouselNext.displayName = 'CarouselNext';

export { type CarouselApi, Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext };
