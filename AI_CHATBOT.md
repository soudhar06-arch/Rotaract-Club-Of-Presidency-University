# AI_CHATBOT.md

## 1. RAG Architecture

### Overview
The chatbot uses Retrieval-Augmented Generation (RAG) to provide accurate, context-aware answers based on club documents.

`
User Query
    ¦
    ?
Query Embedding (OpenAI text-embedding-3-small)
    ¦
    ?
Vector Search (Supabase pgvector)
    ¦
    ?
Top-K Relevant Chunks
    ¦
    ?
Context Assembly (Chunks + System Prompt)
    ¦
    ?
LLM Generation (OpenAI GPT-4o / GPT-4o-mini)
    ¦
    ?
Response with Source Citations
`

### Components
1. **Query Embedder**: Converts user question to vector.
2. **Vector Store**: Supabase pgvector with cosine similarity.
3. **Retriever**: Fetches top-K most similar chunks.
4. **Context Builder**: Combines chunks with system prompt.
5. **LLM**: Generates natural language response.
6. **Citation Extractor**: Identifies source documents for transparency.

## 2. Data Sources

### Supported Document Types
- PDF (.pdf) - Meeting minutes, reports, handbooks
- Word (.docx) - Forms, templates, guidelines
- Text (.txt) - Plain text documents
- Markdown (.md) - Documentation, policies

### Upload Process
1. Admin uploads document via Knowledge Base dashboard.
2. Document stored in Supabase Storage (knowledge-base bucket).
3. Background job extracts text using LangChain loaders.
4. Text split into chunks (1000 chars, 200 overlap).
5. Chunks embedded via OpenAI API.
6. Embeddings stored in DocumentChunk table with pgvector.

### Data Freshness
- Documents processed on upload.
- Re-processing triggered manually if document is updated.
- Old chunks deleted when document is re-uploaded.

## 3. Prompt Strategy

### System Prompt
`
You are a helpful assistant for the Rotaract Club. Your role is to answer questions about the club's activities, membership, events, history, and policies based on the provided context.

Guidelines:
- Only answer using the provided context. If the answer is not in the context, say  I do not have that information. Please contact the club directly.
- Be concise, friendly, and professional.
- If you quote specific information, cite the source document.
- If the user asks about membership applications, direct them to the Join page.
- If the user asks about upcoming events, direct them to the Events page.
- Do not make up information or speculate beyond the context.
`

### User Prompt Template
`
Context from club documents:
{context}

Question: {question}

Answer based only on the context above. Include source citations if available.
`

### Few-Shot Examples
`
Q: When are meetings held?
A: According to the club handbook, meetings are held every Wednesday at 6:00 PM in the Student Center Room 201.

Q: How do I join the club?
A: You can apply to join by visiting the Join page on our website and filling out the membership application form. Applications are reviewed by the board monthly.

Q: What is the membership fee?
A: I do not have that information. Please contact the club directly for current membership fees.
`

## 4. Knowledge Base

### Document Processing Pipeline
1. **Upload**: Admin uploads file to Supabase Storage.
2. **Validation**: Check file type and size (< 10MB).
3. **Extraction**: LangChain loader extracts text.
4. **Chunking**: RecursiveCharacterTextSplitter with 1000/200 settings.
5. **Embedding**: OpenAI text-embedding-3-small (1536 dimensions).
6. **Storage**: Upsert into DocumentChunk table.

### Retrieval Configuration
- **Top-K**: 3 chunks per query.
- **Similarity threshold**: 0.75 (cosine similarity).
- **Max context length**: 3000 characters.
- **Re-ranking**: Optional, not implemented in MVP.

### Chat History
- Session-based conversation context (last 5 messages).
- Stored in ChatLog table for analytics.
- Not used for retrieval (keeps answers focused on documents).

## 5. Future Improvements

### Phase 2
- Multi-turn conversation with full history context.
- Hybrid search (vector + keyword) for better precision.
- Citation links to actual document pages.
- Feedback mechanism (thumbs up/down) to improve retrieval.
- Admin view of chatbot analytics and common queries.

### Phase 3
- Voice input and output.
- Multi-language support.
- Integration with calendar for event-related queries.
- Proactive notifications (e.g., Upcoming event this Friday!).

## 6. Limitations

### Current Constraints
- **Context window**: Limited to top-3 chunks (~3000 chars). Complex questions spanning multiple documents may miss information.
- **Static knowledge**: Only knows what is in uploaded documents. Cannot answer real-time questions (e.g., How many people are at the event today?).
- **Language**: English only in MVP.
- **Document types**: No support for scanned PDFs or images (OCR not implemented).
- **Accuracy**: LLM may occasionally hallucinate if context is ambiguous. Source citations help but do not guarantee 100% accuracy.

### Mitigations
- Clear disclaimer in chatbot: Based on club documents. Contact us for the latest information.
- Escalation prompt for low-confidence answers.
- Regular document updates to keep knowledge base current.

## 7. Security

### Data Protection
- Knowledge documents are admin-only accessible.
- Chat logs stored for 30 days, then purged.
- No PII stored in embeddings or vector store.
- API endpoint rate-limited to prevent abuse.

### Content Filtering
- User inputs screened for inappropriate content via OpenAI moderation API.
- Blocked queries logged for review.

### Access Control
- Chatbot API requires no authentication (public feature).
- Knowledge base management requires Admin role.
- Document uploads scanned for malware (future: virus scanning API).

### Privacy
- Chat sessions are anonymous unless user provides email.
- No tracking cookies for chatbot interactions beyond session ID.
- Chat logs used only for improvement, not shared with third parties.
