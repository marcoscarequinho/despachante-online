var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
import { eq, and } from "drizzle-orm";

// server/db.ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  api_rate_limits: () => api_rate_limits,
  appRoleEnum: () => appRoleEnum,
  auth_attempts: () => auth_attempts,
  clientes: () => clientes,
  documentos: () => documentos,
  insertApiRateLimitSchema: () => insertApiRateLimitSchema,
  insertAuthAttemptSchema: () => insertAuthAttemptSchema,
  insertClienteSchema: () => insertClienteSchema,
  insertDocumentoSchema: () => insertDocumentoSchema,
  insertProfileSchema: () => insertProfileSchema,
  insertSecurityAuditLogSchema: () => insertSecurityAuditLogSchema,
  insertUserSchema: () => insertUserSchema,
  profiles: () => profiles,
  security_audit_logs: () => security_audit_logs,
  selectClienteSchema: () => selectClienteSchema,
  selectDocumentoSchema: () => selectDocumentoSchema,
  selectProfileSchema: () => selectProfileSchema,
  users: () => users
});
import { pgTable, text, serial, integer, boolean, varchar, timestamp, uuid, jsonb, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { sql } from "drizzle-orm";
var appRoleEnum = pgEnum("app_role", ["admin", "cliente"]);
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull()
});
var profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  user_id: varchar("user_id").notNull().unique(),
  email: text("email"),
  nome: text("nome"),
  tipo_usuario: appRoleEnum("tipo_usuario").notNull().default("cliente"),
  created_at: timestamp("created_at").notNull().default(sql`now()`),
  updated_at: timestamp("updated_at").notNull().default(sql`now()`)
});
var clientes = pgTable("clientes", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  nome: text("nome").notNull(),
  cpf: text("cpf").notNull().unique(),
  telefone: text("telefone"),
  email: text("email"),
  endereco: text("endereco"),
  placa_veiculo: text("placa_veiculo"),
  account_status: text("account_status").default("pending_activation"),
  email_verified: boolean("email_verified").default(false),
  last_login_at: timestamp("last_login_at"),
  login_attempts: integer("login_attempts").default(0),
  locked_until: timestamp("locked_until"),
  created_at: timestamp("created_at").notNull().default(sql`now()`),
  updated_at: timestamp("updated_at").notNull().default(sql`now()`)
});
var documentos = pgTable("documentos", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  cliente_id: uuid("cliente_id").references(() => clientes.id, { onDelete: "cascade" }),
  nome: text("nome").notNull(),
  tipo: text("tipo").notNull(),
  url: text("url").notNull(),
  status: text("status").notNull().default("pendente"),
  uploaded_by: varchar("uploaded_by"),
  created_at: timestamp("created_at").notNull().default(sql`now()`),
  updated_at: timestamp("updated_at").notNull().default(sql`now()`)
});
var security_audit_logs = pgTable("security_audit_logs", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  user_id: varchar("user_id"),
  action: text("action").notNull(),
  resource_type: text("resource_type").notNull(),
  resource_id: uuid("resource_id"),
  details: jsonb("details"),
  ip_address: text("ip_address"),
  user_agent: text("user_agent"),
  created_at: timestamp("created_at").notNull().default(sql`now()`)
});
var auth_attempts = pgTable("auth_attempts", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email"),
  identifier: text("identifier"),
  // for client logins (placa/cpf combination)
  attempt_type: text("attempt_type").notNull(),
  // 'admin' or 'client'
  success: boolean("success").notNull().default(false),
  ip_address: text("ip_address"),
  user_agent: text("user_agent"),
  error_message: text("error_message"),
  created_at: timestamp("created_at").notNull().default(sql`now()`)
});
var api_rate_limits = pgTable("api_rate_limits", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  ip_address: text("ip_address").notNull(),
  endpoint: text("endpoint").notNull(),
  request_count: integer("request_count").notNull().default(1),
  window_start: timestamp("window_start").notNull().default(sql`now()`),
  created_at: timestamp("created_at").notNull().default(sql`now()`)
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});
var insertProfileSchema = createInsertSchema(profiles);
var selectProfileSchema = createSelectSchema(profiles);
var insertClienteSchema = createInsertSchema(clientes);
var selectClienteSchema = createSelectSchema(clientes);
var insertDocumentoSchema = createInsertSchema(documentos);
var selectDocumentoSchema = createSelectSchema(documentos);
var insertSecurityAuditLogSchema = createInsertSchema(security_audit_logs);
var insertAuthAttemptSchema = createInsertSchema(auth_attempts);
var insertApiRateLimitSchema = createInsertSchema(api_rate_limits);

// server/db.ts
var connectionString = process.env.DATABASE_URL;
var client = postgres(connectionString);
var db = drizzle(client, { schema: schema_exports });

// server/storage.ts
var PostgresStorage = class {
  // Users
  async getUser(id) {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }
  async getUserByUsername(username) {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }
  async createUser(insertUser) {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }
  // Profiles
  async getProfile(userId) {
    const result = await db.select().from(profiles).where(eq(profiles.user_id, userId)).limit(1);
    return result[0];
  }
  async getProfileByEmail(email) {
    const result = await db.select().from(profiles).where(eq(profiles.email, email)).limit(1);
    return result[0];
  }
  async createProfile(profile) {
    const result = await db.insert(profiles).values(profile).returning();
    return result[0];
  }
  async updateProfile(userId, updates) {
    const result = await db.update(profiles).set({ ...updates, updated_at: /* @__PURE__ */ new Date() }).where(eq(profiles.user_id, userId)).returning();
    return result[0];
  }
  // Clientes
  async getCliente(id) {
    const result = await db.select().from(clientes).where(eq(clientes.id, id)).limit(1);
    return result[0];
  }
  async getClienteByPlacaCpf(placa, cpf) {
    const result = await db.select().from(clientes).where(and(eq(clientes.placa_veiculo, placa), eq(clientes.cpf, cpf))).limit(1);
    return result[0];
  }
  async getAllClientes() {
    return await db.select().from(clientes);
  }
  async createCliente(cliente) {
    const result = await db.insert(clientes).values(cliente).returning();
    return result[0];
  }
  async updateCliente(id, updates) {
    const result = await db.update(clientes).set({ ...updates, updated_at: /* @__PURE__ */ new Date() }).where(eq(clientes.id, id)).returning();
    return result[0];
  }
  // Documentos
  async getDocumentosByCliente(clienteId) {
    return await db.select().from(documentos).where(eq(documentos.cliente_id, clienteId));
  }
  async createDocumento(documento) {
    const result = await db.insert(documentos).values(documento).returning();
    return result[0];
  }
  async updateDocumento(id, updates) {
    const result = await db.update(documentos).set({ ...updates, updated_at: /* @__PURE__ */ new Date() }).where(eq(documentos.id, id)).returning();
    return result[0];
  }
  // Security & Auditing
  async logSecurityEvent(log2) {
    await db.insert(security_audit_logs).values(log2);
  }
  async logAuthAttempt(attempt) {
    await db.insert(auth_attempts).values(attempt);
  }
  async checkRateLimit(ipAddress, endpoint) {
    const oneMinuteAgo = new Date(Date.now() - 60 * 1e3);
    const result = await db.select().from(api_rate_limits).where(and(
      eq(api_rate_limits.ip_address, ipAddress),
      eq(api_rate_limits.endpoint, endpoint)
    ));
    const totalRequests = result.reduce((sum, record) => {
      return record.created_at > oneMinuteAgo ? sum + record.request_count : sum;
    }, 0);
    return totalRequests < 15;
  }
  async updateRateLimit(ipAddress, endpoint) {
    const existing = await db.select().from(api_rate_limits).where(and(
      eq(api_rate_limits.ip_address, ipAddress),
      eq(api_rate_limits.endpoint, endpoint)
    )).limit(1);
    if (existing.length > 0) {
      await db.update(api_rate_limits).set({
        request_count: existing[0].request_count + 1,
        created_at: /* @__PURE__ */ new Date()
      }).where(eq(api_rate_limits.id, existing[0].id));
    } else {
      await db.insert(api_rate_limits).values({
        ip_address: ipAddress,
        endpoint,
        request_count: 1
      });
    }
  }
};
var storage = new PostgresStorage();

// server/routes.ts
import jwt from "jsonwebtoken";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { xai } from "@ai-sdk/xai";
import { generateText } from "ai";
async function registerRoutes(app2) {
  const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key";
  const getClientIP = (req) => {
    return req.headers["x-forwarded-for"] || req.headers["x-real-ip"] || req.connection.remoteAddress || "127.0.0.1";
  };
  const checkRateLimit = async (req, res, next) => {
    const clientIP = getClientIP(req);
    const endpoint = req.path;
    const allowed = await storage.checkRateLimit(clientIP, endpoint);
    if (!allowed) {
      await storage.logSecurityEvent({
        action: "rate_limit_exceeded",
        resource_type: "api",
        ip_address: clientIP,
        user_agent: req.headers["user-agent"],
        details: { endpoint }
      });
      return res.status(429).json({ error: "Rate limit exceeded. Please try again later." });
    }
    await storage.updateRateLimit(clientIP, endpoint);
    next();
  };
  app2.post("/api/consulta-veiculo", checkRateLimit, async (req, res) => {
    try {
      const { placa, chassis, renavam, tipo } = req.body;
      const clientIP = getClientIP(req);
      const userAgent = req.headers["user-agent"] || "";
      if (tipo === "atpv-e") {
        if (!placa || !renavam) {
          return res.status(400).json({
            error: "Para ATPV-E: Placa e RENAVAM s\xE3o obrigat\xF3rios"
          });
        }
      } else {
        if (!placa) {
          return res.status(400).json({ error: "Placa \xE9 obrigat\xF3ria" });
        }
      }
      if (placa) {
        const placaRegex = /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/;
        if (!placaRegex.test(placa.toUpperCase())) {
          return res.status(400).json({
            error: "Formato de placa inv\xE1lido. Use o formato ABC1234 ou ABC1D23"
          });
        }
      }
      const chaveAcesso = process.env.CHAVE_ACESSO_API;
      if (!chaveAcesso) {
        return res.status(500).json({
          error: "Chave de acesso da API n\xE3o configurada"
        });
      }
      await storage.logSecurityEvent({
        action: "vehicle_consultation_attempt",
        resource_type: "api",
        ip_address: clientIP,
        user_agent: userAgent,
        details: {
          tipo,
          placa: placa || null,
          renavam: renavam || null
        }
      });
      let apiUrl = "";
      switch (tipo) {
        case "gravame":
          apiUrl = "https://portaldespachantes.online/consultar-gravame";
          break;
        case "crv-digital":
          apiUrl = "https://portaldespachantes.online/consultar-crv";
          break;
        case "base-estadual":
          apiUrl = "https://portaldespachantes.online/consultar-base-estadual";
          break;
        case "atpv-e":
          apiUrl = "https://portaldespachantes.online/consultar-atpve";
          break;
        default:
          return res.status(400).json({ error: "Tipo de consulta inv\xE1lido" });
      }
      const requestBody = {};
      if (placa) requestBody.placa = placa.toUpperCase();
      if (tipo === "atpv-e" && renavam) requestBody.renavam = renavam;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3e4);
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "chaveAcesso": chaveAcesso,
          "User-Agent": "MC-Despachante/1.0"
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (!response.ok) {
        let errorMessage = "Erro na consulta veicular";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
        }
        await storage.logSecurityEvent({
          action: "vehicle_consultation_error",
          resource_type: "api",
          ip_address: clientIP,
          details: {
            error: errorMessage,
            status: response.status,
            tipo,
            placa: placa || null
          }
        });
        return res.status(response.status).json({ error: errorMessage });
      }
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/pdf")) {
        const pdfBuffer = await response.arrayBuffer();
        const base64Pdf = Buffer.from(pdfBuffer).toString("base64");
        await storage.logSecurityEvent({
          action: "vehicle_consultation_success",
          resource_type: "api",
          ip_address: clientIP,
          details: {
            tipo,
            placa: placa || null,
            response_type: "pdf"
          }
        });
        return res.json({
          success: true,
          data: {
            tipo: "pdf",
            arquivo: base64Pdf,
            contentType: "application/pdf"
          }
        });
      } else {
        const data = await response.json();
        await storage.logSecurityEvent({
          action: "vehicle_consultation_success",
          resource_type: "api",
          ip_address: clientIP,
          details: {
            tipo,
            placa: placa || null,
            response_type: "json"
          }
        });
        return res.json({
          success: true,
          data
        });
      }
    } catch (error) {
      const clientIP = getClientIP(req);
      await storage.logSecurityEvent({
        action: "vehicle_consultation_internal_error",
        resource_type: "api",
        ip_address: clientIP,
        details: {
          error_type: "internal_error"
        }
      });
      return res.status(500).json({
        error: "Erro interno do servidor. Tente novamente."
      });
    }
  });
  app2.post("/api/assistente", checkRateLimit, async (req, res) => {
    try {
      const { pergunta, categoria } = req.body;
      const clientIP = getClientIP(req);
      if (!pergunta || pergunta.trim().length === 0) {
        return res.status(400).json({ error: "Pergunta \xE9 obrigat\xF3ria" });
      }
      const xaiKey = process.env.XAI_API_KEY;
      const openaiKey = process.env.OPENAI_API_KEY;
      const geminiKey = process.env.GEMINI_API_KEY;
      console.log("Verificando chaves dispon\xEDveis:", {
        xai: !!xaiKey,
        openai: !!openaiKey,
        gemini: !!geminiKey
      });
      if (!xaiKey && !openaiKey && !geminiKey) {
        return res.status(500).json({ error: "Nenhuma API Key configurada" });
      }
      let resposta = "";
      let usedProvider = "unknown";
      const systemMessage = `Voc\xEA \xE9 um assistente especializado em servi\xE7os veiculares do Brasil. 
Sua especialidade \xE9 ajudar pessoas com quest\xF5es sobre:
- Transfer\xEAncia de propriedade de ve\xEDculos
- Licenciamento anual (IPVA, DPVAT, taxa de licenciamento)
- Segunda via de documentos (CRV, CRLV, CNH)
- CNH (primeira via, renova\xE7\xE3o, mudan\xE7a de categoria)
- Regulariza\xE7\xE3o de ve\xEDculos (d\xE9bitos, multas, restri\xE7\xF5es)
- Procedimentos junto ao DETRAN
- Documenta\xE7\xE3o necess\xE1ria para cada servi\xE7o
- Prazos e valores aproximados

Responda de forma clara, pr\xE1tica e em portugu\xEAs brasileiro. 
Se n\xE3o souber algo espec\xEDfico, oriente a procurar um despachante ou o DETRAN.
Mantenha as respostas concisas mas informativas.`;
      if (xaiKey) {
        console.log("Tentando usar Grok como API principal...");
        try {
          const { text: text2 } = await generateText({
            model: xai("grok-beta"),
            messages: [
              {
                role: "system",
                content: systemMessage
              },
              {
                role: "user",
                content: pergunta
              }
            ],
            maxTokens: 800,
            temperature: 0.7
          });
          resposta = text2 || "Desculpe, n\xE3o consegui processar sua pergunta.";
          usedProvider = "grok";
        } catch (grokError) {
          console.error("Grok failed, trying Gemini as backup:", grokError?.message || grokError);
          console.error("Grok error details:", grokError);
          if (geminiKey) {
            try {
              const genAI = new GoogleGenerativeAI(geminiKey);
              const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
              const prompt = `${systemMessage}

Pergunta do usu\xE1rio: ${pergunta}`;
              const result = await model.generateContent(prompt);
              const response = await result.response;
              resposta = response.text();
              usedProvider = "gemini";
            } catch (geminiError) {
              console.error("Both Grok and Gemini failed, trying OpenAI:", geminiError);
              if (openaiKey) {
                const openai = new OpenAI({ apiKey: openaiKey });
                const completion = await openai.chat.completions.create({
                  model: "gpt-4o-mini",
                  messages: [
                    {
                      role: "system",
                      content: systemMessage
                    },
                    {
                      role: "user",
                      content: pergunta
                    }
                  ],
                  max_tokens: 800,
                  temperature: 0.7
                });
                resposta = completion.choices[0]?.message?.content || "Desculpe, n\xE3o consegui processar sua pergunta.";
                usedProvider = "openai";
              } else {
                throw new Error("Todos os servi\xE7os de IA falharam");
              }
            }
          } else if (openaiKey) {
            const openai = new OpenAI({ apiKey: openaiKey });
            const completion = await openai.chat.completions.create({
              model: "gpt-4o-mini",
              messages: [
                {
                  role: "system",
                  content: systemMessage
                },
                {
                  role: "user",
                  content: pergunta
                }
              ],
              max_tokens: 800,
              temperature: 0.7
            });
            resposta = completion.choices[0]?.message?.content || "Desculpe, n\xE3o consegui processar sua pergunta.";
            usedProvider = "openai";
          } else {
            throw grokError;
          }
        }
      } else if (geminiKey) {
        const genAI = new GoogleGenerativeAI(geminiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `${systemMessage}

Pergunta do usu\xE1rio: ${pergunta}`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        resposta = response.text();
        usedProvider = "gemini";
      } else if (openaiKey) {
        const openai = new OpenAI({ apiKey: openaiKey });
        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: systemMessage
            },
            {
              role: "user",
              content: pergunta
            }
          ],
          max_tokens: 800,
          temperature: 0.7
        });
        resposta = completion.choices[0]?.message?.content || "Desculpe, n\xE3o consegui processar sua pergunta.";
        usedProvider = "openai";
      }
      await storage.logSecurityEvent({
        action: "ai_assistant_query",
        resource_type: "api",
        ip_address: clientIP,
        user_agent: req.headers["user-agent"] || null,
        user_id: null,
        resource_id: null,
        details: {
          categoria: categoria || "geral",
          pergunta_length: pergunta.length,
          provider_used: usedProvider
        }
      });
      return res.json({
        success: true,
        resposta,
        categoria: categoria || "geral",
        provider: usedProvider
      });
    } catch (error) {
      console.error("AI Assistant error:", error);
      await storage.logSecurityEvent({
        action: "ai_assistant_error",
        resource_type: "api",
        ip_address: getClientIP(req),
        user_agent: req.headers["user-agent"] || null,
        user_id: null,
        resource_id: null,
        details: {
          error_type: "api_error"
        }
      });
      return res.status(500).json({
        error: "Erro ao processar pergunta. Tente novamente."
      });
    }
  });
  app2.post("/api/auth/cliente", checkRateLimit, async (req, res) => {
    try {
      const { placa, cpf } = req.body;
      const clientIP = getClientIP(req);
      if (!placa || !cpf) {
        return res.status(400).json({ error: "Placa e CPF s\xE3o obrigat\xF3rios" });
      }
      const cliente = await storage.getClienteByPlacaCpf(placa, cpf);
      if (!cliente) {
        await storage.logAuthAttempt({
          identifier: `${placa}_${cpf}`,
          attempt_type: "client",
          success: false,
          ip_address: clientIP,
          error_message: "Cliente n\xE3o encontrado"
        });
        return res.status(401).json({ error: "Credenciais inv\xE1lidas" });
      }
      if (cliente.account_status === "suspended" || cliente.account_status === "locked") {
        return res.status(401).json({ error: "Conta suspensa ou bloqueada" });
      }
      const token = jwt.sign(
        {
          userId: cliente.id,
          type: "cliente",
          email: cliente.email
        },
        JWT_SECRET,
        { expiresIn: "24h" }
      );
      await storage.logAuthAttempt({
        identifier: `${placa}_${cpf}`,
        attempt_type: "client",
        success: true,
        ip_address: clientIP
      });
      await storage.updateCliente(cliente.id, {
        last_login_at: /* @__PURE__ */ new Date(),
        login_attempts: 0
      });
      return res.json({
        success: true,
        token,
        user: {
          id: cliente.id,
          nome: cliente.nome,
          email: cliente.email,
          type: "cliente"
        }
      });
    } catch (error) {
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  });
  app2.post("/api/auth/admin", checkRateLimit, async (req, res) => {
    try {
      const { email, senha } = req.body;
      const clientIP = getClientIP(req);
      if (!email || !senha) {
        return res.status(400).json({ error: "Email e senha s\xE3o obrigat\xF3rios" });
      }
      const profile = await storage.getProfileByEmail(email);
      if (!profile || profile.tipo_usuario !== "admin") {
        await storage.logAuthAttempt({
          email,
          attempt_type: "admin",
          success: false,
          ip_address: clientIP,
          error_message: "Usu\xE1rio n\xE3o encontrado"
        });
        return res.status(401).json({ error: "Credenciais inv\xE1lidas" });
      }
      const isValidPassword = senha === "admin123";
      if (!isValidPassword) {
        await storage.logAuthAttempt({
          email,
          attempt_type: "admin",
          success: false,
          ip_address: clientIP,
          error_message: "Senha inv\xE1lida"
        });
        return res.status(401).json({ error: "Credenciais inv\xE1lidas" });
      }
      const token = jwt.sign(
        {
          userId: profile.user_id,
          type: "admin",
          email: profile.email
        },
        JWT_SECRET,
        { expiresIn: "8h" }
      );
      await storage.logAuthAttempt({
        email,
        attempt_type: "admin",
        success: true,
        ip_address: clientIP
      });
      return res.json({
        success: true,
        token,
        user: {
          id: profile.user_id,
          nome: profile.nome,
          email: profile.email,
          type: "admin"
        }
      });
    } catch (error) {
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  });
  app2.get("/api/clientes", async (req, res) => {
    try {
      const clientes2 = await storage.getAllClientes();
      return res.json(clientes2);
    } catch (error) {
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  });
  app2.post("/api/clientes", async (req, res) => {
    try {
      const clienteData = req.body;
      const newCliente = await storage.createCliente(clienteData);
      return res.status(201).json(newCliente);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao criar cliente" });
    }
  });
  app2.get("/api/clientes/:id/documentos", async (req, res) => {
    try {
      const { id } = req.params;
      const documentos2 = await storage.getDocumentosByCliente(id);
      return res.json(documentos2);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao buscar documentos" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
