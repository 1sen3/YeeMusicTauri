import {
  ArrowClockwise24Regular,
  CaretLeft24Filled,
  CaretRight24Filled,
  ChevronRight24Regular,
} from "@fluentui/react-icons";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import { YeeButton } from "../yee-button";

interface SectionProps {
  title: string;
  children: ReactNode;
  seeMore?: boolean;
  refresh?: boolean;
  itemsPerPage?: number;
  itemWidth?: number;
}

export function Section({
  title,
  children,
  seeMore,
  refresh,
  itemsPerPage,
  itemWidth: _itemWidth,
}: SectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const getPagePositions = (container: HTMLDivElement) => {
    const childElements = Array.from(container.children) as HTMLElement[];
    if (childElements.length === 0) return [0];

    const containerRect = container.getBoundingClientRect();
    const maxScrollLeft = Math.max(
      0,
      container.scrollWidth - container.clientWidth,
    );
    const epsilon = 1;

    const items = childElements
      .map((child) => {
        const rect = child.getBoundingClientRect();
        const start = rect.left - containerRect.left + container.scrollLeft;

        return {
          start,
          end: start + rect.width,
        };
      })
      .sort((a, b) => a.start - b.start);

    if (itemsPerPage && itemsPerPage > 0) {
      return items
        .filter((_, index) => index % itemsPerPage === 0)
        .map((item) => Math.min(item.start, maxScrollLeft))
        .filter((position, index, arr) => arr.indexOf(position) === index);
    }

    const pagePositions = [0];
    let pageStart = 0;
    let pageEnd = container.clientWidth;

    for (const item of items) {
      if (item.end > pageEnd + epsilon) {
        pageStart = Math.min(item.start, maxScrollLeft);
        pageEnd = pageStart + container.clientWidth;

        if (pageStart > pagePositions[pagePositions.length - 1] + epsilon) {
          pagePositions.push(pageStart);
        }
      }
    }

    if (maxScrollLeft > pagePositions[pagePositions.length - 1] + epsilon) {
      pagePositions.push(maxScrollLeft);
    }

    return pagePositions;
  };

  const updateScrollState = () => {
    const container = containerRef.current;
    if (!container) {
      setHasOverflow(false);
      setCanScrollPrev(false);
      setCanScrollNext(false);
      return;
    }

    const maxScrollLeft = container.scrollWidth - container.clientWidth;
    const epsilon = 1;
    const overflow = maxScrollLeft > epsilon;
    const pagePositions = getPagePositions(container);
    const currentScrollLeft = container.scrollLeft;
    const firstPage = pagePositions[0] ?? 0;
    const lastPage = pagePositions[pagePositions.length - 1] ?? 0;

    setHasOverflow(overflow);
    setCanScrollPrev(currentScrollLeft > firstPage + epsilon);
    setCanScrollNext(overflow && currentScrollLeft < lastPage - epsilon);
  };

  useEffect(() => {
    updateScrollState();

    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      container.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [children]);

  const scrollToChild = (direction: 1 | -1) => {
    const container = containerRef.current;
    if (!container) return;

    const pagePositions = getPagePositions(container);
    const currentScrollLeft = container.scrollLeft;
    const epsilon = 1;

    const target =
      direction > 0
        ? (pagePositions.find(
            (position) => position > currentScrollLeft + epsilon,
          ) ?? currentScrollLeft)
        : ([...pagePositions]
            .reverse()
            .find((position) => position < currentScrollLeft - epsilon) ??
          currentScrollLeft);

    container.scrollTo({
      left: target,
      behavior: "smooth",
    });
  };

  const handlePrev = () => {
    scrollToChild(-1);
  };

  const handleNext = () => {
    scrollToChild(1);
  };

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          <div
            className={`flex items-center gap-2 group transform transition duration-300 ease-in-out  ${
              seeMore
                ? "cursor-pointer hover:bg-foreground/5 rounded-md hover:translate-x-2 px-2 py-1 -ml-2 -mt-1"
                : ""
            }`}
          >
            {title}
            {seeMore && (
              <ChevronRight24Regular className="size-5 text-foreground/60 group-hover:mr-1" />
            )}
          </div>
        </h2>

        <div className="flex gap-2 text-black/60 items-center">
          {hasOverflow && (
            <>
              <YeeButton
                variant="ghost"
                icon={<CaretLeft24Filled className="size-3" />}
                className="size-6 rounded-full bg-card border! border-border! text-muted-foreground hover:text-muted-foreground"
                onClick={handlePrev}
                disabled={!canScrollPrev}
              />
              <YeeButton
                variant="ghost"
                icon={<CaretRight24Filled className="size-3" />}
                className="size-6 rounded-full bg-card border! border-border! text-muted-foreground hover:text-muted-foreground"
                onClick={handleNext}
                disabled={!canScrollNext}
              />
            </>
          )}
          {refresh && (
            <ArrowClockwise24Regular className="size-5 hover:text-gray-700 cursor-pointer" />
          )}
        </div>
      </div>

      <div
        ref={containerRef}
        className="flex w-full gap-8 overflow-x-auto scroll-smooth *:shrink-0 [&::-webkit-scrollbar]:hidden"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {children}
      </div>
    </section>
  );
}
