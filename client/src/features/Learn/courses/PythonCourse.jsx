// --- PYTHON PROGRAMMING SKILL ROADMAP DEFINITION ---
export const PYTHON_COURSE = {
  id: 'python',
  title: 'Python Programming & Architecture',
  icon: 'python',
  description: 'Master Python Syntax, Data Structures (Lists/Dicts/Sets), Object-Oriented Programming, Asyncio, and FastAPI services.',
  nodes: [
    {
      id: 'py-1',
      position: { x: 350, y: 40 },
      data: {
        label: '1. Python Syntax & High-Performance Data Structures',
        category: 'Core Language',
        status: 'completed',
        overview: 'Master Python list comprehensions, dictionary unpacking, sets for O(1) membership lookups, and Pythonic generator expressions.',
        codeSnippet: `# Pythonic List & Dict Comprehension Example
users = [
    {'id': 1, 'name': 'Alex', 'role': 'admin'},
    {'id': 2, 'name': 'Sam', 'role': 'hunter'},
    {'id': 3, 'name': 'Chris', 'role': 'hunter'}
]

# Set comprehension for O(1) lookups
admin_ids = {u['id'] for u in users if u['role'] == 'admin'}
print("Admin IDs set:", admin_ids)

# Dict comprehension mapping
user_map = {u['id']: u['name'] for u in users}
print("User lookup map:", user_map)
`,
        tools: ['Python 3.12', 'IPython', 'Ruff Linter'],
        testQuestion: {
          question: 'What is the average time complexity of checking membership (`x in my_set`) in a Python `set`?',
          options: ['O(1) constant time', 'O(N) linear time', 'O(N^2)', 'O(log N)'],
          correctIndex: 0,
          explanation: 'Python sets are implemented as hash tables, providing O(1) average lookup time.'
        }
      }
    },
    {
      id: 'py-2',
      position: { x: 350, y: 150 },
      data: {
        label: '2. OOP, Dunder Methods & Context Managers',
        category: 'Advanced Python',
        status: 'completed',
        overview: 'Master custom classes, magic dunder methods (__init__, __enter__, __exit__, __repr__), and the `with` statement for resource safety.',
        codeSnippet: `# Custom Context Manager Class for Safe Resource Allocation
class DatabaseSession:
    def __init__(self, db_name="production_db"):
        self.db_name = db_name

    def __enter__(self):
        print(f"Connecting to {self.db_name}...")
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        print("Closing database connection safely.")

with DatabaseSession() as db:
    print("Executing query on session...")
`,
        tools: ['Python Type Hints (mypy)', 'Contextlib'],
        testQuestion: {
          question: 'Which two dunder methods must a class implement to be used as a context manager with the `with` keyword?',
          options: ['__enter__ and __exit__', '__open__ and __close__', '__start__ and __stop__', '__init__ and __del__'],
          correctIndex: 0,
          explanation: '`__enter__` sets up the runtime context and `__exit__` handles cleanup.'
        }
      }
    },
    {
      id: 'py-3',
      position: { x: 350, y: 260 },
      data: {
        label: '3. Custom Decorators & Metaprogramming',
        category: 'Functional Patterns',
        status: 'active',
        overview: 'Master function decorators with functools.wraps, execution timers, caching decorators, and variable arguments (*args, **kwargs).',
        codeSnippet: `import time
from functools import wraps

def timing_decorator(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        duration = (time.perf_counter() - start) * 1000
        print(f"[{func.__name__}] executed in {duration:.2f}ms")
        return result
    return wrapper

@timing_decorator
def compute_heavy_hash(data):
    return sum(ord(c) for c in data)

print("Result:", compute_heavy_hash("ShadowCoderPlatform"))
`,
        tools: ['functools', 'Decorators'],
        testQuestion: {
          question: 'Why should you always use `@functools.wraps(func)` inside custom Python decorators?',
          options: ['It preserves the original function name, docstrings, and metadata', 'It doubles execution speed', 'It prevents all syntax errors', 'It encrypts the function'],
          correctIndex: 0,
          explanation: '`functools.wraps` copies the original function attributes (name, docstring, annotations) to the wrapper function.'
        }
      }
    },
    {
      id: 'py-4',
      position: { x: 350, y: 370 },
      data: {
        label: '4. Asyncio & High-Concurrency I/O',
        category: 'Concurrency',
        status: 'unlocked',
        overview: 'Master Python asyncio, async/await event loops, asyncio.gather() parallel coroutines, and task exception handling.',
        codeSnippet: `import asyncio

async def fetch_api_mock(endpoint: str, delay: float):
    await asyncio.sleep(delay)
    return f"Response from {endpoint}"

async def main():
    print("Spawning concurrent async tasks...")
    results = await asyncio.gather(
        fetch_api_mock("/users", 0.1),
        fetch_api_mock("/orders", 0.15)
    )
    print("Concurrent results:", results)

# asyncio.run(main())
`,
        tools: ['asyncio', 'aiohttp', 'uvloop'],
        testQuestion: {
          question: 'When is `asyncio` preferred over multi-threading in Python?',
          options: ['For high-concurrency I/O-bound operations (network requests, DB queries) without thread overhead', 'For heavy CPU matrix multiplication', 'Never', 'Only on mobile devices'],
          correctIndex: 0,
          explanation: '`asyncio` uses single-threaded cooperative multitasking, making it ideal for handling thousands of concurrent I/O-bound connections.'
        }
      }
    },
    {
      id: 'py-5',
      position: { x: 350, y: 480 },
      data: {
        label: '5. FastAPI Microservices & Pydantic Validation',
        category: 'Web Services',
        status: 'unlocked',
        overview: 'Build high-performance REST APIs with FastAPI, Pydantic data validation, async def endpoints, and dependency injection.',
        codeSnippet: `from fastapi import FastAPI
from pydantic import BaseModel, Field

app = FastAPI()

class CodeReviewRequest(BaseModel):
    code: str = Field(..., min_length=5)
    language: str = "python"

@app.post("/api/audit")
async def audit_code(payload: CodeReviewRequest):
    return {
        "status": "success",
        "score": 96,
        "language": payload.language
    }
`,
        tools: ['FastAPI', 'Pydantic v2', 'Uvicorn'],
        testQuestion: {
          question: 'What library does FastAPI use under the hood for automatic request data validation and serialization?',
          options: ['Pydantic', 'Django ORM', 'Marshmallow', 'Cerberus'],
          correctIndex: 0,
          explanation: 'FastAPI is built on top of Starlette and Pydantic for high-speed schema parsing and validation.'
        }
      }
    }
  ],
  edges: [
    { id: 'epy-1-2', source: 'py-1', target: 'py-2', type: 'smoothstep', style: { stroke: '#10b981', strokeWidth: 3 } },
    { id: 'epy-2-3', source: 'py-2', target: 'py-3', type: 'smoothstep', animated: true, style: { stroke: '#3b82f6', strokeWidth: 3 } },
    { id: 'epy-3-4', source: 'py-3', target: 'py-4', type: 'smoothstep', style: { stroke: '#6366f1', strokeWidth: 3 } },
    { id: 'epy-4-5', source: 'py-4', target: 'py-5', type: 'smoothstep', style: { stroke: '#8b5cf6', strokeWidth: 3 } },
  ]
};
