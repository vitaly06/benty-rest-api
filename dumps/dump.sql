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
    "resetPasswordVerificationCode" text
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
-- Name: ProfileType id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProfileType" ALTER COLUMN id SET DEFAULT nextval('public."ProfileType_id_seq"'::regclass);


--
-- Name: User id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);


--
-- Data for Name: ProfileType; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ProfileType" (id, name) FROM stdin;
1	Личный
2	Компания
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, login, email, password, "profileTypeId", "createdAt", "updatedAt", "refreshToken", "emailVerificationCode", "isEmailVerified", "isResetVerified", "resetPasswordVerificationCode") FROM stdin;
6	vitaly.sadikov	vitaly.sadikov1@yandex.ru	$2b$10$UcS.a/DzfOH3A9RMhFkdBOvHtBa1Cq9cM1vawnerReDRK9xKGY5K.	1	2025-07-03 11:03:00.473	2025-07-03 11:03:21.461	$2b$10$k4MDQfsDHVaWa7aRF9o9Iu9aGNezuDzuNniz7QMFKmB.bTp9KS9Au	\N	t	f	\N
\.


--
-- Name: ProfileType_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ProfileType_id_seq"', 2, true);


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."User_id_seq"', 6, true);


--
-- Name: ProfileType ProfileType_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProfileType"
    ADD CONSTRAINT "ProfileType_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: ProfileType_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "ProfileType_name_key" ON public."ProfileType" USING btree (name);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: User_login_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_login_key" ON public."User" USING btree (login);


--
-- Name: User User_profileTypeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_profileTypeId_fkey" FOREIGN KEY ("profileTypeId") REFERENCES public."ProfileType"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

