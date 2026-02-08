---
description: "TypeScript 5 + ES2022 development patterns, type safety best practices, and modern JavaScript features for the Smoking Tracker PWA"
applyTo: "**/*.ts, **/*.tsx, tsconfig.json"
---

# TypeScript 5 + ES2022 Development Instructions

Modern TypeScript with ES2022 features, strict type safety, and best practices for React applications.

## Core Principles

- **Strict mode enabled**: Maximum type safety
- **No `any` types**: Use proper types or `unknown`
- **Type inference**: Let TypeScript infer when possible
- **Pure ES modules**: No CommonJS
- **Modern features**: ES2022+ including top-level await, private fields

## TypeScript Configuration

### Strict tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",

    /* Strict Type Checking */
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,

    /* Additional Checks */
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,

    /* Module Resolution */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },
    "resolveJsonModule": true,
    "allowImportingTsExtensions": true,

    /* Emit */
    "noEmit": true,
    "jsx": "react-jsx",
    "isolatedModules": true,

    /* Interop */
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,

    /* Type Checking */
    "skipLibCheck": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

## Type Safety Patterns

### Interface vs Type Alias

**Use `interface` for:**

- Object shapes
- Component props
- API contracts
- Extensible structures

```typescript
interface User {
  id: string;
  name: string;
  email: string;
}

// Interfaces can be extended
interface AdminUser extends User {
  role: "admin";
  permissions: string[];
}
```

**Use `type` for:**

- Union types
- Intersection types
- Utility types
- Primitive aliases

```typescript
type Status = "idle" | "loading" | "success" | "error";
type ID = string | number;
type Nullable<T> = T | null;
```

### Discriminated Unions

Powerful pattern for state management:

```typescript
type LoadState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

function renderUser(state: LoadState<User>) {
  switch (state.status) {
    case 'idle':
      return <div>Click to load</div>;
    case 'loading':
      return <div>Loading...</div>;
    case 'success':
      return <div>{state.data.name}</div>; // Type-safe: data exists
    case 'error':
      return <div>Error: {state.error.message}</div>; // Type-safe: error exists
  }
}
```

### Type Guards

Custom type guards for runtime type checking:

```typescript
function isError(value: unknown): value is Error {
  return value instanceof Error;
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isSmokingLog(value: unknown): value is SmokingLog {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "timestamp" in value &&
    "triggerIds" in value
  );
}

// Usage
try {
  // ... code
} catch (err) {
  if (isError(err)) {
    console.error(err.message); // Type-safe
  }
}
```

### Utility Types

Leverage TypeScript's built-in utility types:

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

// Partial - All properties optional
type PartialUser = Partial<User>;

// Pick - Select specific properties
type UserPreview = Pick<User, "id" | "name">;

// Omit - Exclude specific properties
type UserWithoutPassword = Omit<User, "password">;

// Readonly - Immutable
type ReadonlyUser = Readonly<User>;

// Record - Key-value map
type UserMap = Record<string, User>;

// Required - All properties required
type RequiredUser = Required<Partial<User>>;
```

### Generic Types

Create reusable type-safe functions and components:

```typescript
// Generic function
function firstElement<T>(arr: T[]): T | undefined {
  return arr[0];
}

const num = firstElement([1, 2, 3]); // Type: number | undefined
const str = firstElement(['a', 'b']); // Type: string | undefined

// Generic React component
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
  renderItem={user => <span>{user.name}</span>}
  keyExtractor={user => user.id}
/>
```

### Type Assertions (Use Sparingly)

```typescript
// Good: Type guard
function processValue(value: unknown) {
  if (typeof value === "string") {
    return value.toUpperCase(); // Type-safe
  }
}

// Acceptable: When you know better than TypeScript
const element = document.getElementById("root") as HTMLElement;

// Avoid: Can hide bugs
const data = JSON.parse(jsonString) as User; // ❌ No validation

// Better: Validate and narrow
const data: unknown = JSON.parse(jsonString);
if (isUser(data)) {
  // Use type guard
  // data is now User
}
```

## React TypeScript Patterns

### Component Props

```typescript
// Simple props
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

// Props with children
interface CardProps {
  title: string;
  children: React.ReactNode;
}

// Props with event handlers
interface InputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
}

// Props extending HTML attributes
interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

function CustomButton({ variant = 'primary', ...props }: CustomButtonProps) {
  return <button {...props} className={`btn-${variant}`} />;
}
```

### Hooks with TypeScript

```typescript
// useState with explicit type
const [user, setUser] = useState<User | null>(null);
const [count, setCount] = useState(0); // Inferred as number

// useReducer with discriminated unions
type Action =
  | { type: "increment" }
  | { type: "decrement" }
  | { type: "set"; value: number };

function reducer(state: number, action: Action): number {
  switch (action.type) {
    case "increment":
      return state + 1;
    case "decrement":
      return state - 1;
    case "set":
      return action.value;
  }
}

const [count, dispatch] = useReducer(reducer, 0);

// useRef with typed elements
const inputRef = useRef<HTMLInputElement>(null);
const divRef = useRef<HTMLDivElement>(null);

// Custom hook with generics
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
}
```

### Event Handlers

```typescript
// Mouse events
function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
  console.log(event.currentTarget);
}

// Input events
function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
  console.log(event.target.value);
}

// Form events
function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();
  // Handle form submission
}

// Keyboard events
function handleKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
  if (event.key === "Enter") {
    // Handle enter key
  }
}

// Generic event callback
type EventHandler<T = HTMLElement> = (event: React.SyntheticEvent<T>) => void;
```

## ES2022+ Features

### Top-Level Await

```typescript
// main.ts - Top-level await (in modules)
const config = await fetch("/api/config").then((r) => r.json());

// Initialize app with config
initApp(config);
```

### Private Class Fields

```typescript
class UserService {
  // Private field (ES2022)
  #apiKey: string;

  constructor(apiKey: string) {
    this.#apiKey = apiKey;
  }

  async fetchUser(id: string): Promise<User> {
    // Private field accessible within class
    return fetch(`/api/users/${id}`, {
      headers: { "X-API-Key": this.#apiKey },
    }).then((r) => r.json());
  }
}

const service = new UserService("secret");
// service.#apiKey; // ❌ Error: Private field
```

### Nullish Coalescing & Optional Chaining

```typescript
// Nullish coalescing (??) - Only null/undefined
const count = userInput ?? 0; // Use 0 if null/undefined, keeps 0, false, ''

// vs. Logical OR (||) - Falsy values
const count2 = userInput || 0; // Use 0 for null, undefined, 0, false, ''

// Optional chaining (?.)
const userName = user?.profile?.name ?? "Anonymous";
const firstPost = posts?.[0]?.title;

// Optional function call
const result = onSuccess?.();
```

### Logical Assignment Operators

```typescript
// Nullish coalescing assignment (??=)
let config = null;
config ??= getDefaultConfig(); // Assign only if null/undefined

// Logical OR assignment (||=)
let status = "";
status ||= "active"; // Assign if falsy

// Logical AND assignment (&&=)
let user = getCurrentUser();
user &&= user.name; // Assign if truthy
```

### Array Methods

```typescript
// at() - Negative indexing
const arr = [1, 2, 3, 4, 5];
const last = arr.at(-1); // 5
const secondLast = arr.at(-2); // 4

// findLast() and findLastIndex()
const logs = [
  { id: 1, status: "pending" },
  { id: 2, status: "complete" },
  { id: 3, status: "pending" },
];

const lastPending = logs.findLast((log) => log.status === "pending");
// { id: 3, status: 'pending' }
```

## Async/Await Patterns

```typescript
// Parallel async operations
async function fetchUserData(userId: string) {
  const [user, posts, comments] = await Promise.all([
    fetchUser(userId),
    fetchPosts(userId),
    fetchComments(userId),
  ]);

  return { user, posts, comments };
}

// Error handling
async function loadData() {
  try {
    const data = await fetchData();
    return { success: true, data };
  } catch (error) {
    if (isError(error)) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Unknown error" };
  }
}

// Async IIFE
(async () => {
  const data = await loadData();
  console.log(data);
})();
```

## Type-Safe LocalStorage

```typescript
interface StorageSchema {
  smokingLogs: SmokingLog[];
  triggers: Trigger[];
  goal: Goal | null;
  settings: Settings;
}

class TypedStorage {
  get<K extends keyof StorageSchema>(key: K): StorageSchema[K] | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  }

  set<K extends keyof StorageSchema>(key: K, value: StorageSchema[K]): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Failed to save to localStorage", error);
    }
  }

  remove(key: keyof StorageSchema): void {
    localStorage.removeItem(key);
  }
}

const storage = new TypedStorage();

// Type-safe usage
const logs = storage.get("smokingLogs"); // Type: SmokingLog[] | null
storage.set("goal", { dailyLimit: 10, startDate: Date.now() }); // Type-safe
```

## Best Practices

✓ **Enable strict mode** in tsconfig.json  
✓ **Avoid `any`** - use `unknown` and type guards  
✓ **Use discriminated unions** for complex state  
✓ **Leverage type inference** where possible  
✓ **Use utility types** (Partial, Pick, Omit, etc.)  
✓ **Create custom type guards** for runtime validation  
✓ **Type event handlers** explicitly  
✓ **Use `as const`** for literal types  
✓ **Prefer interfaces** for object shapes  
✓ **Prefer type aliases** for unions/intersections  
✓ **Use generics** for reusable type-safe code  
✓ **Use optional chaining** (`?.`) and nullish coalescing (`??`)

## Common Mistakes to Avoid

❌ Using `any` type  
❌ Ignoring strict null checks  
❌ Type assertions without validation  
❌ Overly complex types  
❌ Not using type guards for `unknown`  
❌ Using `@ts-ignore` or `@ts-expect-error` without good reason  
❌ Not enabling strict mode  
❌ Mutating readonly types

✅ Use proper types or `unknown`  
✅ Handle null/undefined explicitly  
✅ Validate before asserting  
✅ Keep types simple and composable  
✅ Use type guards for narrowing  
✅ Fix the actual issue instead of ignoring  
✅ Enable strict mode for safety  
✅ Respect immutability

## Troubleshooting

### Type Errors

**Error: Type 'X' is not assignable to type 'Y'**

- Check property types match exactly
- Use type guards to narrow types
- Consider using union types or discriminated unions

**Error: Object is possibly 'null' or 'undefined'**

- Use optional chaining: `obj?.property`
- Provide fallback: `obj ?? defaultValue`
- Add null check: `if (obj !== null) { ... }`

**Error: Property 'X' does not exist on type 'Y'**

- Verify the type definition includes the property
- Use type assertion if you're certain: `(obj as ExtendedType).property`
- Better: Add property to type definition or use type guard

## Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
