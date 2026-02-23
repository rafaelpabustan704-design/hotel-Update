'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

interface UseCrudCollectionOptions<T> {
  basePath: string;
  initialData?: T[];
}

interface CrudCollection<T extends { id: string }> {
  items: T[];
  setItems: React.Dispatch<React.SetStateAction<T[]>>;
  add: (data: Omit<T, 'id'>) => Promise<T>;
  update: (id: string, data: Partial<T>) => Promise<T>;
  remove: (id: string) => Promise<void>;
  refetch: () => Promise<void>;
}

export function useCrudCollection<T extends { id: string }>(
  opts: UseCrudCollectionOptions<T>,
): CrudCollection<T> {
  const { basePath, initialData = [] } = opts;
  const [items, setItems] = useState<T[]>(initialData);
  const fetchedOnce = useRef(false);

  const refetch = useCallback(async () => {
    try {
      const res = await fetch(basePath);
      const data = await res.json();
      if (Array.isArray(data)) setItems(data);
    } catch { /* keep stale state */ }
  }, [basePath]);

  useEffect(() => {
    if (!fetchedOnce.current) {
      fetchedOnce.current = true;
      refetch();
    }
  }, [refetch]);

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === 'visible') refetch();
    };
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', refetch);
    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', refetch);
    };
  }, [refetch]);

  const add = useCallback(async (data: Omit<T, 'id'>): Promise<T> => {
    const res = await fetch(basePath, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const created = await res.json() as T;
    setItems((prev) => [...prev, created]);
    return created;
  }, [basePath]);

  const update = useCallback(async (id: string, data: Partial<T>): Promise<T> => {
    const res = await fetch(`${basePath}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const updated = await res.json() as T;
    setItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
    return updated;
  }, [basePath]);

  const remove = useCallback(async (id: string): Promise<void> => {
    await fetch(`${basePath}/${id}`, { method: 'DELETE' });
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, [basePath]);

  return { items, setItems, add, update, remove, refetch };
}

interface UseSingletonOptions<T> {
  basePath: string;
  initialData: T;
}

interface CrudSingleton<T> {
  data: T;
  setData: React.Dispatch<React.SetStateAction<T>>;
  update: (patch: Partial<T>) => Promise<T>;
  refetch: () => Promise<void>;
}

export function useCrudSingleton<T>(
  opts: UseSingletonOptions<T>,
): CrudSingleton<T> {
  const { basePath, initialData } = opts;
  const [data, setData] = useState<T>(initialData);
  const fetchedOnce = useRef(false);

  const refetch = useCallback(async () => {
    try {
      const res = await fetch(basePath);
      const d = await res.json();
      setData(d as T);
    } catch { /* keep stale state */ }
  }, [basePath]);

  useEffect(() => {
    if (!fetchedOnce.current) {
      fetchedOnce.current = true;
      refetch();
    }
  }, [refetch]);

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === 'visible') refetch();
    };
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', refetch);
    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', refetch);
    };
  }, [refetch]);

  const update = useCallback(async (patch: Partial<T>): Promise<T> => {
    const res = await fetch(basePath, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    });
    const updated = await res.json() as T;
    setData(updated);
    return updated;
  }, [basePath]);

  return { data, setData, update, refetch };
}
