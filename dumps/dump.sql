--
-- PostgreSQL database dump
--

-- Dumped from database version 14.18 (Ubuntu 14.18-0ubuntu0.22.04.1)
-- Dumped by pg_dump version 14.18 (Ubuntu 14.18-0ubuntu0.22.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Category" (
    id integer NOT NULL,
    name text NOT NULL
);


ALTER TABLE public."Category" OWNER TO postgres;

--
-- Name: Category_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Category_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Category_id_seq" OWNER TO postgres;

--
-- Name: Category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Category_id_seq" OWNED BY public."Category".id;


--
-- Name: ProfileType; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ProfileType" (
    id integer NOT NULL,
    name text NOT NULL
);


ALTER TABLE public."ProfileType" OWNER TO postgres;

--
-- Name: ProfileType_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."ProfileType_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."ProfileType_id_seq" OWNER TO postgres;

--
-- Name: ProfileType_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."ProfileType_id_seq" OWNED BY public."ProfileType".id;


--
-- Name: Project; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Project" (
    id integer NOT NULL,
    name text NOT NULL,
    "photoName" text NOT NULL,
    "categoryId" integer NOT NULL,
    "userId" integer NOT NULL
);


ALTER TABLE public."Project" OWNER TO postgres;

--
-- Name: Project_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Project_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Project_id_seq" OWNER TO postgres;

--
-- Name: Project_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Project_id_seq" OWNED BY public."Project".id;


--
-- Name: Specialization; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Specialization" (
    id integer NOT NULL,
    name text NOT NULL
);


ALTER TABLE public."Specialization" OWNER TO postgres;

--
-- Name: Specialization_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Specialization_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Specialization_id_seq" OWNER TO postgres;

--
-- Name: Specialization_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Specialization_id_seq" OWNED BY public."Specialization".id;


--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id integer NOT NULL,
    login text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    "profileTypeId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "refreshToken" text,
    "emailVerificationCode" text,
    "isEmailVerified" boolean DEFAULT false NOT NULL,
    "isResetVerified" boolean DEFAULT false NOT NULL,
    "resetPasswordVerificationCode" text,
    "specializationId" integer,
    "logoFileName" text,
    "fullName" text,
    city text
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: User_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."User_id_seq" OWNER TO postgres;

--
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;


--
-- Name: Category id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Category" ALTER COLUMN id SET DEFAULT nextval('public."Category_id_seq"'::regclass);


--
-- Name: ProfileType id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProfileType" ALTER COLUMN id SET DEFAULT nextval('public."ProfileType_id_seq"'::regclass);


--
-- Name: Project id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Project" ALTER COLUMN id SET DEFAULT nextval('public."Project_id_seq"'::regclass);


--
-- Name: Specialization id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Specialization" ALTER COLUMN id SET DEFAULT nextval('public."Specialization_id_seq"'::regclass);


--
-- Name: User id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);


--
-- Data for Name: Category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Category" (id, name) FROM stdin;
3	Медицина
\.


--
-- Data for Name: ProfileType; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ProfileType" (id, name) FROM stdin;
1	Личный
2	Компания
\.


--
-- Data for Name: Project; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Project" (id, name, "photoName", "categoryId", "userId") FROM stdin;
2	Брендинг недвижимости Homotiq	1751622214349-830472717.png	3	6
3	Syncfine Fintech Branding	1751622348345-606634986.png	3	7
4	Брендинг недвижимости Homotiq	1751622370914-153436948.png	3	8
5	Брендинг SunVault Eco Energy	1751622387365-230599585.png	3	6
6	Брендинг фестиваля Visiou	1751622409601-423421912.png	3	7
7	Nexus — Visual identity	1751622432970-468433038.png	3	8
8	Тематическое исследование: Дизайн музыкального приложения	1751622451975-973069535.png	3	6
9	Web3Pay© — Visual identity	1751622474871-653089185.png	3	7
\.


--
-- Data for Name: Specialization; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Specialization" (id, name) FROM stdin;
1	SMM
2	Агенство
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, login, email, password, "profileTypeId", "createdAt", "updatedAt", "refreshToken", "emailVerificationCode", "isEmailVerified", "isResetVerified", "resetPasswordVerificationCode", "specializationId", "logoFileName", "fullName", city) FROM stdin;
6	vitaly.sadikov	vitaly.sadikov1@yandex.ru	$2b$10$UcS.a/DzfOH3A9RMhFkdBOvHtBa1Cq9cM1vawnerReDRK9xKGY5K.	1	2025-07-03 11:03:00.473	2025-07-04 11:00:50.344	$2b$10$k4MDQfsDHVaWa7aRF9o9Iu9aGNezuDzuNniz7QMFKmB.bTp9KS9Au	\N	t	f	\N	1	ava1.png	Садиков Виталий	Оренбург
7	vital1y.sadikov	vitaly.sadikov2@yandex.ru	$2b$10$IkWiRHyJr0JYr4EsnTrDL.mEvkjoDc3FnwMhQq9mR0Z9eHdzH.0J.	1	2025-07-04 08:55:39.068	2025-07-04 11:00:50.344	\N	4.0188	f	f	\N	2	ava2.png	Афанасий Афанасьевич	Москва
8	vital1332y.sadikov	vitaly.sadikov232@yandex.ru	$2b$10$Q3/C/I3NtwH6S65bMLJEM.GN09YQzI1F3UuriuFgZ3CfLX7WoNyJK	1	2025-07-04 08:58:47.464	2025-07-04 11:00:50.344	$2b$10$183MhKoCPo2J7OQrDaD3xekd8FOVWTGO5KPagC7JFGet0o8XXOAO2	281913	f	f	\N	1	ava3.png	Артур Пирожков	Челябинск
\.


--
-- Name: Category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Category_id_seq"', 3, true);


--
-- Name: ProfileType_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ProfileType_id_seq"', 2, true);


--
-- Name: Project_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Project_id_seq"', 9, true);


--
-- Name: Specialization_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Specialization_id_seq"', 2, true);


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."User_id_seq"', 8, true);


--
-- Name: Category Category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Category"
    ADD CONSTRAINT "Category_pkey" PRIMARY KEY (id);


--
-- Name: ProfileType ProfileType_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProfileType"
    ADD CONSTRAINT "ProfileType_pkey" PRIMARY KEY (id);


--
-- Name: Project Project_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Project"
    ADD CONSTRAINT "Project_pkey" PRIMARY KEY (id);


--
-- Name: Specialization Specialization_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Specialization"
    ADD CONSTRAINT "Specialization_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: Category_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Category_name_key" ON public."Category" USING btree (name);


--
-- Name: ProfileType_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "ProfileType_name_key" ON public."ProfileType" USING btree (name);


--
-- Name: Specialization_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Specialization_name_key" ON public."Specialization" USING btree (name);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: User_login_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_login_key" ON public."User" USING btree (login);


--
-- Name: Project Project_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Project"
    ADD CONSTRAINT "Project_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."Category"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Project Project_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Project"
    ADD CONSTRAINT "Project_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: User User_profileTypeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_profileTypeId_fkey" FOREIGN KEY ("profileTypeId") REFERENCES public."ProfileType"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: User User_specializationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_specializationId_fkey" FOREIGN KEY ("specializationId") REFERENCES public."Specialization"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

