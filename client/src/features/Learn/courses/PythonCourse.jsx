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
        label: '1. Python Syntax & Data Structures',
        category: 'Core Language',
        status: 'completed',
        overview: 'Master Python list comprehensions, dictionary unpacking, sets for O(1) membership lookups, and Pythonic generator expressions.',
        codeSnippet: `# Pythonic List & Dict Comprehension Example\nusers = [{'id': 1, 'role': 'admin'}, {'id': 2, 'role': 'hunter'}]\nadmin_ids = {u['id'] for u in users if u['role'] == 'admin'}\nuser_map = {u['id']: u['role'] for u in users}`,
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
        codeSnippet: `# Custom Context Manager Class\nclass DatabaseSession:\n  def __enter__(self):\n    print("Connecting to DB...")\n    return self\n  def __exit__(self, exc_type, exc_val, exc_tb):\n    print("Closing connection.")\n\nwith DatabaseSession() as db:\n  print("Executing query...")`,
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
        label: '3. Asyncio & FastAPI Microservices',
        category: 'Web & API',
        status: 'active',
        overview: 'Build high-performance REST APIs with FastAPI, Pydantic data validation, async def endpoints, and non-blocking background tasks.',
        codeSnippet: `# FastAPI Async API Endpoint\nfrom fastapi import FastAPI\nfrom pydantic import BaseModel\n\napp = FastAPI()\n\nclass AuditPayload(BaseModel):\n  code: str\n  language: str\n\n@app.post("/analyze")\nasync def analyze_ast(payload: AuditPayload):\n  return {"success": True, "score": 95}`,
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
  ]
};
