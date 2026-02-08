---
description: Backend-specific agent instructions (future extensibility)
---

# Backend Development - Agent Instructions

## Current Architecture

**Status:** localStorage-only (no backend server)

This application currently uses browser localStorage for all data persistence. There is **no backend server** in the initial implementation.

## Future Backend Considerations

If a backend is added in the future, this document will guide the implementation.

### Potential Use Cases for Backend

1. **Multi-Device Sync**
   - Sync data across user's devices
   - Requires user authentication
   - Cloud storage (Firebase, Supabase, or custom API)

2. **Advanced Analytics**
   - Server-side data processing
   - Aggregate anonymous statistics
   - Machine learning for pattern detection

3. **Social Features**
   - Support groups/communities
   - Share progress (opt-in)
   - Accountability partners

4. **Data Backup**
   - Automatic cloud backup
   - Restore from backup
   - Export to multiple formats

## Proposed Backend Stack (Future)

### Option 1: Firebase/Supabase (Easiest)
- **Authentication:** Firebase Auth / Supabase Auth
- **Database:** Firestore / PostgreSQL
- **Storage:** Firebase Storage / Supabase Storage
- **Hosting:** Firebase Hosting / Vercel

**Pros:**
- Quick setup
- Built-in authentication
- Real-time sync
- Free tier available

**Cons:**
- Vendor lock-in
- Limited customization

### Option 2: Custom API (Most Flexible)
- **Framework:** FastAPI (Python) or Express (Node.js)
- **Database:** PostgreSQL or MongoDB
- **Authentication:** JWT tokens
- **Hosting:** Railway, Render, or Fly.io

**Pros:**
- Full control
- Custom business logic
- No vendor lock-in

**Cons:**
- More setup required
- Need to manage infrastructure

## Data Migration Strategy

### From localStorage to Backend

When migrating to a backend, preserve existing user data:

```typescript
// Migration utility
async function migrateLocalDataToBackend() {
  // 1. Get all localStorage data
  const logs = getSmokingLogs();
  const customTriggers = getCustomTriggers();
  const goal = getMonthlyGoal();
  
  // 2. Upload to backend
  await api.uploadLogs(logs);
  await api.uploadTriggers(customTriggers);
  await api.updateGoal(goal);
  
  // 3. Verify upload success
  const backendLogs = await api.getLogs();
  if (backendLogs.length === logs.length) {
    // 4. Clear localStorage (optional)
    // Keep as backup or clear to save space
  }
}
```

### Hybrid Approach (Offline-First)

Even with a backend, maintain offline-first architecture:

1. **Write to localStorage first** (instant feedback)
2. **Sync to backend** when online (background)
3. **Resolve conflicts** (last-write-wins or user choice)

```typescript
// Offline-first pattern
async function addLog(log: SmokingLog) {
  // 1. Save locally (always works)
  saveToLocalStorage(log);
  
  // 2. Try to sync to backend
  if (navigator.onLine) {
    try {
      await api.createLog(log);
      markAsSynced(log.id);
    } catch (error) {
      // Queue for retry
      addToSyncQueue(log);
    }
  } else {
    // Queue for when online
    addToSyncQueue(log);
  }
}
```

## API Design Patterns (Future)

### RESTful Endpoints

```
POST   /api/auth/register          # Create account
POST   /api/auth/login             # Login
POST   /api/auth/logout            # Logout

GET    /api/logs                   # Get all logs
POST   /api/logs                   # Create log
DELETE /api/logs/:id               # Delete log

GET    /api/triggers/custom        # Get custom triggers
POST   /api/triggers/custom        # Add custom trigger
DELETE /api/triggers/custom/:id    # Delete custom trigger

GET    /api/goals/current          # Get current goal
PUT    /api/goals/current          # Update goal

GET    /api/export                 # Export data (CSV)
POST   /api/import                 # Import data
```

### Data Models (Backend)

```python
# SQLAlchemy models (example)

class User(Base):
    __tablename__ = "users"
    
    id = Column(UUID, primary_key=True)
    email = Column(String, unique=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    logs = relationship("SmokingLog", back_populates="user")
    triggers = relationship("CustomTrigger", back_populates="user")
    goals = relationship("MonthlyGoal", back_populates="user")

class SmokingLog(Base):
    __tablename__ = "smoking_logs"
    
    id = Column(UUID, primary_key=True)
    user_id = Column(UUID, ForeignKey("users.id"))
    timestamp = Column(DateTime, nullable=False)
    trigger = Column(String, nullable=False)
    date = Column(Date, nullable=False)
    
    user = relationship("User", back_populates="logs")

class CustomTrigger(Base):
    __tablename__ = "custom_triggers"
    
    id = Column(UUID, primary_key=True)
    user_id = Column(UUID, ForeignKey("users.id"))
    name = Column(String, nullable=False)
    
    user = relationship("User", back_populates="triggers")

class MonthlyGoal(Base):
    __tablename__ = "monthly_goals"
    
    id = Column(UUID, primary_key=True)
    user_id = Column(UUID, ForeignKey("users.id"))
    month = Column(String, nullable=False)  # YYYY-MM
    limit = Column(Integer, nullable=False)
    
    user = relationship("User", back_populates="goals")
```

## Authentication Patterns (Future)

### JWT Token Flow

```typescript
// Login
const { accessToken, refreshToken } = await api.login(email, password);
localStorage.setItem('accessToken', accessToken);
localStorage.setItem('refreshToken', refreshToken);

// API requests with auth
async function authenticatedFetch(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem('accessToken');
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (response.status === 401) {
    // Token expired, refresh
    await refreshAccessToken();
    return authenticatedFetch(url, options); // Retry
  }
  
  return response;
}
```

### Privacy & Security

1. **Data Encryption**
   - Encrypt sensitive data at rest
   - Use HTTPS for all API calls
   - Hash passwords (bcrypt, argon2)

2. **Data Ownership**
   - Users own their data
   - Easy export (GDPR compliance)
   - Account deletion removes all data

3. **Anonymous Analytics**
   - Aggregate stats only (no PII)
   - Opt-in for sharing
   - Clear privacy policy

## Sync Strategy (Future)

### Conflict Resolution

When data conflicts between local and server:

```typescript
async function resolveConflict(
  localLog: SmokingLog,
  serverLog: SmokingLog
): Promise<SmokingLog> {
  // Strategy 1: Last-write-wins
  return localLog.timestamp > serverLog.timestamp ? localLog : serverLog;
  
  // Strategy 2: Ask user
  // return await showConflictDialog(localLog, serverLog);
  
  // Strategy 3: Merge (if applicable)
  // return mergeLogData(localLog, serverLog);
}
```

### Sync Queue

```typescript
interface SyncQueueItem {
  id: string;
  action: 'create' | 'update' | 'delete';
  resource: 'log' | 'trigger' | 'goal';
  data: any;
  timestamp: string;
  retries: number;
}

class SyncQueue {
  private queue: SyncQueueItem[] = [];
  
  async processQueue() {
    while (this.queue.length > 0 && navigator.onLine) {
      const item = this.queue[0];
      
      try {
        await this.syncItem(item);
        this.queue.shift(); // Remove from queue
      } catch (error) {
        item.retries++;
        if (item.retries > 3) {
          // Move to failed queue or notify user
          this.handleFailedSync(item);
          this.queue.shift();
        } else {
          // Retry later
          break;
        }
      }
    }
  }
}
```

## Testing Backend (Future)

### Unit Tests
```python
# pytest example
def test_create_log(client, auth_headers):
    response = client.post(
        "/api/logs",
        json={
            "trigger": "Stress",
            "timestamp": "2026-02-08T12:00:00Z"
        },
        headers=auth_headers
    )
    assert response.status_code == 201
    assert response.json()["trigger"] == "Stress"
```

### Integration Tests
```python
def test_full_logging_flow(client):
    # 1. Register user
    register_response = client.post("/api/auth/register", json={
        "email": "test@example.com",
        "password": "secure123"
    })
    
    # 2. Login
    login_response = client.post("/api/auth/login", json={
        "email": "test@example.com",
        "password": "secure123"
    })
    token = login_response.json()["accessToken"]
    
    # 3. Create log
    log_response = client.post(
        "/api/logs",
        json={"trigger": "Stress"},
        headers={"Authorization": f"Bearer {token}"}
    )
    
    # 4. Verify log exists
    logs_response = client.get(
        "/api/logs",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert len(logs_response.json()) == 1
```

## Deployment (Future)

### Environment Variables
```bash
# .env
DATABASE_URL=postgresql://user:pass@host:5432/dbname
JWT_SECRET=your-secret-key
CORS_ORIGINS=https://your-app.com
```

### Docker Setup
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## Current Implementation Notes

**For now:**
- All data stored in localStorage
- No authentication needed
- No server costs
- Works completely offline
- Privacy by default (data never leaves device)

**When to add backend:**
- User requests multi-device sync
- Need for advanced analytics
- Want social features
- Require data backup/restore

## Migration Checklist (Future)

When implementing backend:

- [ ] Choose backend stack (Firebase vs custom)
- [ ] Set up authentication
- [ ] Design database schema
- [ ] Implement API endpoints
- [ ] Build sync mechanism
- [ ] Add conflict resolution
- [ ] Migrate existing localStorage data
- [ ] Update frontend to use API
- [ ] Maintain offline-first functionality
- [ ] Add error handling for network failures
- [ ] Implement data encryption
- [ ] Write backend tests
- [ ] Deploy to production
- [ ] Monitor performance and errors
