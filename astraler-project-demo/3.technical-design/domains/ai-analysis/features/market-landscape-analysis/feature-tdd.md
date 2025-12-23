# Feature TDD: Market Landscape Analysis

## 1. Pipeline Implementation (`ai_analysis/pipelines/market_landscape.py`)
Using LangChain `LCEL`.

```python
# Prompt
prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a strategic consultant. Analyze these competitors..."),
    ("user", "{competitor_data}")
])

# Model
model = ChatOpenAI(model="gpt-4o", temperature=0)

# Chain
chain = prompt | model | JsonOutputParser(pydantic_object=SWOTAnalysis)

async def run_analysis(project_id: UUID):
    # 1. Fetch Data
    competitors = await project_service.get_competitors(project_id)
    reviews =   await data_service.get_top_reviews(project_id)
    
    # 2. Format
    context = format_context(competitors, reviews)
    
    # 3. Run AI
    try:
        result = await chain.ainvoke({"competitor_data": context})
    except RateLimitError:
        raise RetryableError()
        
    # 4. Save
    await db.execute(
        "INSERT INTO analysis_results (project_id, type, data) VALUES ...",
        type="MARKET_LANDSCAPE", data=result.dict()
    )
```
