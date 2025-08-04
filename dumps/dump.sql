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
    "userId" integer NOT NULL,
    content jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    description text,
    "firstLink" text,
    "secondLink" text,
    "specializationId" integer NOT NULL
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
    "isEmailVerified" boolean DEFAULT false NOT NULL,
    "isResetVerified" boolean DEFAULT false NOT NULL,
    "logoFileName" text,
    "fullName" text,
    city text,
    about text,
    level text,
    "phoneNumber" text,
    telegram text,
    vk text,
    website text,
    experience text,
    "coverFileName" text,
    "joinAuthorsNotifications" boolean DEFAULT false NOT NULL,
    "weeklySummaryNotifications" boolean DEFAULT false NOT NULL,
    "rewardNotifications" boolean DEFAULT false NOT NULL,
    "lastLoginUpdate" timestamp(3) without time zone
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
-- Name: _User Specializations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."_User Specializations" (
    "A" integer NOT NULL,
    "B" integer NOT NULL
);


ALTER TABLE public."_User Specializations" OWNER TO postgres;

--
-- Name: _UserFollows; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."_UserFollows" (
    "A" integer NOT NULL,
    "B" integer NOT NULL
);


ALTER TABLE public."_UserFollows" OWNER TO postgres;

--
-- Name: _UserLikes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."_UserLikes" (
    "A" integer NOT NULL,
    "B" integer NOT NULL
);


ALTER TABLE public."_UserLikes" OWNER TO postgres;

--
-- Name: _UserStarred; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."_UserStarred" (
    "A" integer NOT NULL,
    "B" integer NOT NULL
);


ALTER TABLE public."_UserStarred" OWNER TO postgres;

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

COPY public."Project" (id, name, "photoName", "categoryId", "userId", content, "createdAt", "updatedAt", description, "firstLink", "secondLink", "specializationId") FROM stdin;
2	Брендинг недвижимости Homotiq	1751622214349-830472717.png	3	6	\N	2025-08-03 21:00:30.746	2025-08-03 21:00:30.746	\N	\N	\N	1
3	Syncfine Fintech Branding	1751622348345-606634986.png	3	7	\N	2025-08-03 21:00:30.746	2025-08-03 21:00:30.746	\N	\N	\N	1
4	Брендинг недвижимости Homotiq	1751622370914-153436948.png	3	8	\N	2025-08-03 21:00:30.746	2025-08-03 21:00:30.746	\N	\N	\N	1
5	Брендинг SunVault Eco Energy	1751622387365-230599585.png	3	6	\N	2025-08-03 21:00:30.746	2025-08-03 21:00:30.746	\N	\N	\N	1
6	Брендинг фестиваля Visiou	1751622409601-423421912.png	3	7	\N	2025-08-03 21:00:30.746	2025-08-03 21:00:30.746	\N	\N	\N	1
7	Nexus — Visual identity	1751622432970-468433038.png	3	8	\N	2025-08-03 21:00:30.746	2025-08-03 21:00:30.746	\N	\N	\N	1
8	Тематическое исследование: Дизайн музыкального приложения	1751622451975-973069535.png	3	6	\N	2025-08-03 21:00:30.746	2025-08-03 21:00:30.746	\N	\N	\N	1
9	Web3Pay© — Visual identity	1751622474871-653089185.png	3	7	\N	2025-08-03 21:00:30.746	2025-08-03 21:00:30.746	\N	\N	\N	1
10	Система тестирования	1752235166056-826103934.png	3	6	\N	2025-08-03 21:00:30.746	2025-08-03 21:00:30.746	\N	\N	\N	1
11	Система тестирования	1752235182470-903627617.png	3	7	\N	2025-08-03 21:00:30.746	2025-08-03 21:00:30.746	\N	\N	\N	1
12	Система тестирования	1752235202230-60995368.png	3	8	\N	2025-08-03 21:00:30.746	2025-08-03 21:00:30.746	\N	\N	\N	1
13	Система тестирования2	1752235204864-261067350.png	3	8	\N	2025-08-03 21:00:30.746	2025-08-03 21:00:30.746	\N	\N	\N	1
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

COPY public."User" (id, login, email, password, "profileTypeId", "createdAt", "updatedAt", "refreshToken", "isEmailVerified", "isResetVerified", "logoFileName", "fullName", city, about, level, "phoneNumber", telegram, vk, website, experience, "coverFileName", "joinAuthorsNotifications", "weeklySummaryNotifications", "rewardNotifications", "lastLoginUpdate") FROM stdin;
7	vital1y.sadikov	vitaly.sadikov2@yandex.ru	$2b$10$IkWiRHyJr0JYr4EsnTrDL.mEvkjoDc3FnwMhQq9mR0Z9eHdzH.0J.	1	2025-07-04 08:55:39.068	2025-07-04 11:00:50.344	\N	f	f	ava2.png	Афанасий Афанасьевич	Москва	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	\N
8	vital1332y.sadikov	vitaly.sadikov232@yandex.ru	$2b$10$Q3/C/I3NtwH6S65bMLJEM.GN09YQzI1F3UuriuFgZ3CfLX7WoNyJK	1	2025-07-04 08:58:47.464	2025-07-04 11:00:50.344	$2b$10$183MhKoCPo2J7OQrDaD3xekd8FOVWTGO5KPagC7JFGet0o8XXOAO2	f	f	ava3.png	Артур Пирожков	Челябинск	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	\N
9	vitaly.sadikov444	vitaly.sadikov133@yandex.ru	$2b$10$7C4aR3bURQjyA1GvX./VSutZ0dmioRNscT3nl/tnhxgpBUh1fDfIC	1	2025-07-07 11:39:00.097	2025-07-07 11:39:01.328	$2b$10$U.g2pY9cUDT0Zai/wGpq.ulKj8rpXM0nVVtw6MZ0wvI/D2Eh.WIUi	f	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	\N
10	vitaly.sadikov222	egorskomorohov020606@gmail.com	$2b$10$edmVUmZYfdRF6.ZyFfI4cO/X7IYfzykuaMByQbBl9IEkT3OWykjwy	1	2025-07-10 07:31:46.4	2025-07-10 07:32:29.146	$2b$10$SofNG6kr9RKjCzlseI8OFu.wTef79yQqFvepzdOvKHtu3ZXOv04Vi	t	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	\N
11	tgflk	tgflk_tuv@mail.ru	$2b$10$vzwiWqqrOo6OstA.dWHmJuI8.sY/8OJ6hpAEKCPlA7gB.Yi5mOTA6	1	2025-07-14 18:39:22.108	2025-07-14 18:40:13.792	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjExLCJsb2dpbiI6InRnZmxrIiwiaWF0IjoxNzUyNTE4NDEzLCJleHAiOjE3NTMxMjMyMTN9.kWrY-bIHzM0X04J76hk78SeCvFu_5wcHPuep3ANvrCo	t	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	\N
6	vitaly.sadikkov222	vitaly.sadikov1@yandex.ru	$2b$10$UcS.a/DzfOH3A9RMhFkdBOvHtBa1Cq9cM1vawnerReDRK9xKGY5K.	1	2025-07-03 11:03:00.473	2025-07-11 10:02:29.474	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjYsImlhdCI6MTc1MjIyODE0OSwiZXhwIjoxNzUyODMyOTQ5fQ.BGgGPajkcn6-A--3jA0f6K85AV3He5-HTNAYOLvwc54	t	f	ava1.png	Садиков Виталий	Оренбург	Я backend разработчик, пишу код на NestJs и учусь.	Middle	+79860271933	@ciganit	vk.com/sobaka	best-backend.ru	Менее года	\N	f	f	f	2025-07-09 07:06:03.17
\.


--
-- Data for Name: _User Specializations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_User Specializations" ("A", "B") FROM stdin;
1	6
2	6
\.


--
-- Data for Name: _UserFollows; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_UserFollows" ("A", "B") FROM stdin;
7	6
8	6
9	6
10	6
\.


--
-- Data for Name: _UserLikes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_UserLikes" ("A", "B") FROM stdin;
\.


--
-- Data for Name: _UserStarred; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_UserStarred" ("A", "B") FROM stdin;
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

SELECT pg_catalog.setval('public."Project_id_seq"', 13, true);


--
-- Name: Specialization_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Specialization_id_seq"', 2, true);


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."User_id_seq"', 11, true);


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
-- Name: _User Specializations _User Specializations_AB_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_User Specializations"
    ADD CONSTRAINT "_User Specializations_AB_pkey" PRIMARY KEY ("A", "B");


--
-- Name: _UserFollows _UserFollows_AB_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_UserFollows"
    ADD CONSTRAINT "_UserFollows_AB_pkey" PRIMARY KEY ("A", "B");


--
-- Name: _UserLikes _UserLikes_AB_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_UserLikes"
    ADD CONSTRAINT "_UserLikes_AB_pkey" PRIMARY KEY ("A", "B");


--
-- Name: _UserStarred _UserStarred_AB_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_UserStarred"
    ADD CONSTRAINT "_UserStarred_AB_pkey" PRIMARY KEY ("A", "B");


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
-- Name: _User Specializations_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_User Specializations_B_index" ON public."_User Specializations" USING btree ("B");


--
-- Name: _UserFollows_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_UserFollows_B_index" ON public."_UserFollows" USING btree ("B");


--
-- Name: _UserLikes_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_UserLikes_B_index" ON public."_UserLikes" USING btree ("B");


--
-- Name: _UserStarred_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_UserStarred_B_index" ON public."_UserStarred" USING btree ("B");


--
-- Name: Project Project_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Project"
    ADD CONSTRAINT "Project_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."Category"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Project Project_specializationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Project"
    ADD CONSTRAINT "Project_specializationId_fkey" FOREIGN KEY ("specializationId") REFERENCES public."Specialization"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


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
-- Name: _User Specializations _User Specializations_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_User Specializations"
    ADD CONSTRAINT "_User Specializations_A_fkey" FOREIGN KEY ("A") REFERENCES public."Specialization"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _User Specializations _User Specializations_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_User Specializations"
    ADD CONSTRAINT "_User Specializations_B_fkey" FOREIGN KEY ("B") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _UserFollows _UserFollows_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_UserFollows"
    ADD CONSTRAINT "_UserFollows_A_fkey" FOREIGN KEY ("A") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _UserFollows _UserFollows_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_UserFollows"
    ADD CONSTRAINT "_UserFollows_B_fkey" FOREIGN KEY ("B") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _UserLikes _UserLikes_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_UserLikes"
    ADD CONSTRAINT "_UserLikes_A_fkey" FOREIGN KEY ("A") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _UserLikes _UserLikes_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_UserLikes"
    ADD CONSTRAINT "_UserLikes_B_fkey" FOREIGN KEY ("B") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _UserStarred _UserStarred_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_UserStarred"
    ADD CONSTRAINT "_UserStarred_A_fkey" FOREIGN KEY ("A") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _UserStarred _UserStarred_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_UserStarred"
    ADD CONSTRAINT "_UserStarred_B_fkey" FOREIGN KEY ("B") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

