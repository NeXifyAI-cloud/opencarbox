'use client'

import React from 'react'

export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded bg-gray-200 dark:bg-gray-700 ${className}`}
      role="status"
      aria-label="Loading"
    />
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="space-y-4 rounded-lg border bg-white p-4 shadow">
      <Skeleton className="aspect-square w-full rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <Skeleton className="h-10 w-full" />
    </div>
  )
}

export function ProductGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function AppointmentCardSkeleton() {
  return (
    <div className="space-y-3 rounded-lg border bg-white p-4 shadow">
      <Skeleton className="h-6 w-3/4" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <Skeleton className="mt-4 h-10 w-full" />
    </div>
  )
}

export function AppointmentListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <AppointmentCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function TableRowSkeleton() {
  return (
    <div className="flex gap-4 border-b p-4">
      <Skeleton className="h-8 w-10" />
      <Skeleton className="h-8 flex-1" />
      <Skeleton className="h-8 flex-1" />
      <Skeleton className="h-8 flex-1" />
      <Skeleton className="h-8 w-20" />
    </div>
  )
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="overflow-hidden rounded-lg border">
      <div className="flex gap-4 border-b bg-gray-50 p-4">
        <Skeleton className="h-6 w-10" />
        <Skeleton className="h-6 flex-1" />
        <Skeleton className="h-6 flex-1" />
        <Skeleton className="h-6 flex-1" />
        <Skeleton className="h-6 w-20" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <TableRowSkeleton key={i} />
      ))}
    </div>
  )
}

export function DetailPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="space-y-4 rounded-lg border p-4">
            <Skeleton className="aspect-square w-full rounded-lg" />
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-lg" />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2 rounded-lg border p-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
      </div>
    </div>
  )
}

export function FormSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      ))}
      <Skeleton className="h-12 w-full rounded-lg" />
    </div>
  )
}
