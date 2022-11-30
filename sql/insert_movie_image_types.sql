--
-- PostgreSQL database dump
--

-- Dumped from database version 14.4
-- Dumped by pg_dump version 14.4

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

--
-- Data for Name: movie_image_types; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.movie_image_types (id, name) VALUES (1, 'poster');
INSERT INTO public.movie_image_types (id, name) VALUES (2, 'frame');
INSERT INTO public.movie_image_types (id, name) VALUES (3, 'promo');


--
-- Name: movie_image_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.movie_image_types_id_seq', 1, false);


--
-- PostgreSQL database dump complete
--

