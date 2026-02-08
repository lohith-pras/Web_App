---
description: "React 19 development patterns, hooks, TypeScript integration, and best practices for the Smoking Tracker PWA"
applyTo: "**/*.tsx, **/*.jsx, **/*.ts, **/*.js"
---

# React 19 Development Instructions

Modern React development patterns leveraging React 19 features, functional components, hooks, and TypeScript.

## Core Principles

- **Functional components only** - No class components
- **Hooks for state and effects** - useState, useEffect, custom hooks
- **TypeScript throughout** - Strict typing for props, state, handlers
- **Performance by default** - Memoization, lazy loading, code splitting
- **Accessibility first** - WCAG 2.1 AA compliance, semantic HTML

## Component Patterns

### Functional Components with TypeScript

Always use functional components with proper TypeScript interfaces:

```typescript
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  children?: React.ReactNode;
}

export function Button({
  label,
  onClick,
  variant = 'primary',
  disabled = false
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant}`}
      aria-label={label}
    >
      {label}
    </button>
  );
}
```

### Component Composition

Prefer composition over props drilling:

```typescript
// Good - Composition
function Card({ children }: { children: React.ReactNode }) {
  return <div className="card">{children}</div>;
}

function CardHeader({ children }: { children: React.ReactNode }) {
  return <div className="card-header">{children}</div>;
}

function CardBody({ children }: { children: React.ReactNode }) {
  return <div className="card-body">{children}</div>;
}

// Usage
<Card>
  <CardHeader><h2>Title</h2></CardHeader>
  <CardBody><p>Content</p></CardBody>
</Card>
```

## State Management

### Local State with useState

```typescript
function Counter() {
  const [count, setCount] = useState<number>(0);

  const increment = () => setCount(prev => prev + 1);
  const decrement = () => setCount(prev => prev - 1);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  );
}
```

### Custom Hooks for Reusable Logic

Extract complex logic into custom hooks:

```typescript
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

// Usage
function SearchInput() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    // Only triggers 300ms after user stops typing
    console.log('Search for:', debouncedSearch);
  }, [debouncedSearch]);

  return <input value={search} onChange={e => setSearch(e.target.value)} />;
}
```

## Effects and Side Effects

### useEffect Best Practices

```typescript
function DataFetcher({ userId }: { userId: string }) {
  const [data, setData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch(`/api/users/${userId}`);
        const userData = await response.json();

        if (!cancelled) {
          setData(userData);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('Unknown error'));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      cancelled = true; // Cleanup: prevent state updates on unmounted component
    };
  }, [userId]); // Dependencies: re-run when userId changes

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return null;

  return <div>{data.name}</div>;
}
```

## Performance Optimization

### React.memo for Expensive Components

```typescript
interface ExpensiveListProps {
  items: Item[];
  onItemClick: (id: string) => void;
}

// Only re-renders when props actually change
export const ExpensiveList = React.memo(function ExpensiveList({
  items,
  onItemClick
}: ExpensiveListProps) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id} onClick={() => onItemClick(item.id)}>
          {item.name}
        </li>
      ))}
    </ul>
  );
});
```

### useMemo and useCallback

```typescript
function Dashboard({ logs }: { logs: Log[] }) {
  // Memoize expensive computation
  const aggregatedData = useMemo(() => {
    return logs.reduce((acc, log) => {
      // Expensive calculation
      return acc;
    }, {});
  }, [logs]);

  // Memoize callback to prevent child re-renders
  const handleLogDelete = useCallback((logId: string) => {
    // Delete logic
  }, []); // Empty deps means function never changes

  return (
    <div>
      <DataDisplay data={aggregatedData} />
      <LogList logs={logs} onDelete={handleLogDelete} />
    </div>
  );
}
```

## Optimistic Updates (React 19)

```typescript
import { useState, useOptimistic } from 'react';

function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    todos,
    (state, newTodo: Todo) => [...state, newTodo]
  );

  async function handleAddTodo(title: string) {
    const newTodo = { id: crypto.randomUUID(), title, completed: false };

    // Optimistically add to UI immediately
    addOptimisticTodo(newTodo);

    try {
      // Save to backend/LocalStorage
      await saveTodo(newTodo);
      // Update actual state
      setTodos(prev => [...prev, newTodo]);
    } catch (error) {
      // Error: optimistic update will automatically revert
      console.error('Failed to add todo');
    }
  }

  return (
    <ul>
      {optimisticTodos.map(todo => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  );
}
```

## Error Handling

### Error Boundaries

```typescript
import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="error-container">
          <h2>Something went wrong</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false, error: null })}>
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

## Accessibility

### Semantic HTML and ARIA

```typescript
function AccessibleButton({
  label,
  onClick,
  loading
}: {
  label: string;
  onClick: () => void;
  loading?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      aria-label={label}
      aria-busy={loading}
      type="button"
    >
      {loading ? 'Loading...' : label}
    </button>
  );
}

function Modal({
  isOpen,
  onClose,
  title,
  children
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="modal-overlay"
    >
      <div className="modal-content">
        <h2 id="modal-title">{title}</h2>
        <button onClick={onClose} aria-label="Close modal">
          ×
        </button>
        {children}
      </div>
    </div>
  );
}
```

## TypeScript Patterns

### Discriminated Unions for State

```typescript
type LoadingState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: User }
  | { status: 'error'; error: Error };

function UserProfile() {
  const [state, setState] = useState<LoadingState>({ status: 'idle' });

  useEffect(() => {
    setState({ status: 'loading' });
    fetchUser()
      .then(data => setState({ status: 'success', data }))
      .catch(error => setState({ status: 'error', error }));
  }, []);

  switch (state.status) {
    case 'idle':
      return <div>Click to load</div>;
    case 'loading':
      return <div>Loading...</div>;
    case 'success':
      return <div>{state.data.name}</div>; // Type-safe: data exists here
    case 'error':
      return <div>Error: {state.error.message}</div>; // Type-safe: error exists here
  }
}
```

### Generic Components

```typescript
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  keyExtractor: (item: T) => string;
}

function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
  return (
    <ul>
      {items.map(item => (
        <li key={keyExtractor(item)}>
          {renderItem(item)}
        </li>
      ))}
    </ul>
  );
}

// Usage with type inference
<List
  items={users}
  renderItem={user => <UserCard user={user} />}
  keyExtractor={user => user.id}
/>
```

## Testing Patterns

### Component Testing

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Counter } from './Counter';

describe('Counter', () => {
  test('renders initial count', () => {
    render(<Counter initialCount={0} />);
    expect(screen.getByText('Count: 0')).toBeInTheDocument();
  });

  test('increments count on button click', () => {
    render(<Counter initialCount={0} />);
    const button = screen.getByRole('button', { name: 'Increment' });
    fireEvent.click(button);
    expect(screen.getByText('Count: 1')).toBeInTheDocument();
  });
});
```

## Best Practices Summary

✓ Use functional components with TypeScript interfaces  
✓ Extract reusable logic into custom hooks  
✓ Implement proper cleanup in useEffect  
✓ Use React.memo, useMemo, useCallback for performance  
✓ Leverage React 19 features: useOptimistic, Actions API  
✓ Implement error boundaries for graceful failure  
✓ Follow accessibility guidelines (WCAG 2.1 AA)  
✓ Use discriminated unions for complex state  
✓ Write tests for critical components  
✓ Keep components small and focused (single responsibility)  
✓ Avoid props drilling - use composition or context  
✓ Never mutate state directly - use setter functions  
✓ Provide proper TypeScript types for all props and state
