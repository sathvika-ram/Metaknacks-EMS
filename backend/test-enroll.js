async function test() {
    try {
        const apiBaseUrl = (process.env.API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');
        const testValues = {
            authToken: process.env.TEST_AUTH_TOKEN,
            coordinatorId: process.env.TEST_COORDINATOR_ID,
            region: process.env.TEST_REGION,
            constituency: process.env.TEST_CONSTITUENCY,
            mandal: process.env.TEST_MANDAL,
            village: process.env.TEST_VILLAGE
        };
        if (Object.values(testValues).some(value => !value)) {
            throw new Error('Set TEST_AUTH_TOKEN, TEST_COORDINATOR_ID, TEST_REGION, TEST_CONSTITUENCY, TEST_MANDAL, and TEST_VILLAGE before running this manual enrollment test.');
        }

        const res = await fetch(`${apiBaseUrl}/api/voters/enroll`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${testValues.authToken}` },
            body: JSON.stringify({
                coordinator_id: testValues.coordinatorId,
                voter_name: 'Test Voter',
                father_name: 'Test Father',
                mobile_number: '9876543210',
                citizenship_status: true,
                region: testValues.region,
                constituency: testValues.constituency,
                mandal: testValues.mandal,
                village: testValues.village,
                district: testValues.region,
                gender: 'Other',
                acknowledgement_number: `TEST${String(Date.now()).slice(-12).padStart(12, '0')}`,
                degree_qualification: 'BTech',
                graduation_year: "2012",
                degree_certificate_url: 'http://test.com/cert.pdf'
            })
        });
        const data = await res.json();
        console.log(res.status, data);
    } catch (err) {
        console.error("Error:", err);
    }
}
test();
