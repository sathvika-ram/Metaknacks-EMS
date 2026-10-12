CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email VARCHAR(255) UNIQUE,
    mobile_number VARCHAR(20),
    password_hash TEXT NOT NULL,
    role VARCHAR(40) NOT NULL CHECK (role IN ('super_admin', 'party_leader', 'constituency_coordinator')),
    assigned_region VARCHAR(120),
    assigned_constituency VARCHAR(120),
    assigned_mandal VARCHAR(120),
    personal_email VARCHAR(255),
    agent_personal_email VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS voters (
    id BIGSERIAL PRIMARY KEY,
    coordinator_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    voter_name TEXT NOT NULL,
    surname VARCHAR(120),
    father_name TEXT NOT NULL,
    mobile_number VARCHAR(20) NOT NULL,
    constituency VARCHAR(120),
    mandal VARCHAR(120),
    village TEXT NOT NULL,
    degree_certificate_url TEXT,
    degree_certificate_urls TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    enrollment_status VARCHAR(20) NOT NULL DEFAULT 'pending'
        CHECK (enrollment_status IN ('pending', 'in_progress', 'approved', 'rejected')),
    voter_id VARCHAR(10),
    aadhaar_number VARCHAR(12),
    gender VARCHAR(40) NOT NULL,
    email VARCHAR(255),
    acknowledgement_number VARCHAR(16) NOT NULL,
    complete_address TEXT,
    district VARCHAR(120) NOT NULL,
    pincode VARCHAR(6),
    region VARCHAR(120),
    notes TEXT,
    submission_key VARCHAR(120),
    post_office VARCHAR(255),
    photo_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    details JSONB NOT NULL DEFAULT '{}'::jsonb,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS master_geography (
    id BIGSERIAL PRIMARY KEY,
    "Old District" TEXT,
    "AC No" TEXT,
    "Assembly Constituency" TEXT,
    "Mandal" TEXT,
    "Village" TEXT,
    "Village LGD Code" TEXT,
    "Gram Panchayat" TEXT,
    "Gram Panchayat LGD Code" TEXT,
    "Pincode" TEXT,
    "Source" TEXT
);