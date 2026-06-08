// Public API for SK Dental using Supabase

const SUPABASE_URL = 'https://uicuadqmvmwhtepkzvfi.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_KEfEgsBf_qXePvbM5zlHOw_peYMuj8p';

if (typeof supabase !== 'undefined') {
    window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

document.addEventListener('DOMContentLoaded', async () => {
    if (!window.supabaseClient) return;

    // 1. Fetch Site Settings
    const loadSiteSettings = async () => {
        const { data, error } = await supabaseClient
            .from('site_settings')
            .select('*')
            .eq('id', 1)
            .single();

        if (data) {
            const els = {
                'dyn_about': data.about_text,
                'dyn_phone': data.phone,
                'dyn_email': data.email,
                'dyn_address': data.address,
                'dyn_timings': data.timings,
                'dyn_fee': data.fee_amount
            };
            for (const [id, value] of Object.entries(els)) {
                const el = document.getElementById(id);
                // Also handle multiple elements if needed by using classes, 
                // but we will use IDs for specific injections.
                if (el && value) el.innerText = value;
                
                // For hrefs like phone and email
                const linkEls = document.querySelectorAll(`.${id}_link`);
                linkEls.forEach(link => {
                    if (id === 'dyn_phone') link.href = `tel:${value.replace(/[^0-9+]/g, '')}`;
                    if (id === 'dyn_email') link.href = `mailto:${value}`;
                });
            }
        }
    };

    // 2. Fetch Latest Cases (3 max)
    const loadCases = async () => {
        const casesGrid = document.getElementById('dyn_cases_grid');
        if (!casesGrid) return;

        const { data, error } = await supabaseClient
            .from('cases')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(3);

        if (data && data.length > 0) {
            casesGrid.innerHTML = data.map(c => `
                <div class="case-card" data-aos>
                    <img src="${c.featured_image || 'assets/images/placeholder.jpg'}" alt="${c.title}" style="width:100%; height:200px; object-fit:cover; border-radius:var(--radius-md);">
                    <h3 style="margin-top:15px; font-size:1.1rem; color:var(--text);">${c.title}</h3>
                    <p style="color:var(--text-muted); font-size:0.9rem;">${c.category}</p>
                </div>
            `).join('');
        }
    };

    // 3. Fetch Latest Approved Reviews
    const loadReviews = async () => {
        const reviewsGrid = document.getElementById('dyn_reviews_grid');
        if (!reviewsGrid) return;

        const { data, error } = await supabaseClient
            .from('testimonials')
            .select('*')
            .eq('is_published', true)
            .order('created_at', { ascending: false })
            .limit(6);

        if (data && data.length > 0) {
            reviewsGrid.innerHTML = data.map(r => `
                <div class="review__card" data-aos>
                    <div class="review__stars" aria-label="${r.rating} out of 5 stars">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</div>
                    <p class="review__text">"${r.text}"</p>
                    <div class="review__author">
                        <div class="review__avatar" aria-hidden="true">${r.avatar_letter || r.name.charAt(0).toUpperCase()}</div>
                        <div class="review__meta">
                            <span class="review__name">${r.name}</span>
                            <span class="review__source">${r.source === 'google' ? 'Google Review' : 'Patient'}</span>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    };

    // 4. Handle Review Submission Form
    const reviewForm = document.getElementById('submitReviewForm');
    if (reviewForm) {
        reviewForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('submitReviewBtn');
            const status = document.getElementById('submitReviewStatus');
            btn.disabled = true;
            status.innerText = 'Submitting...';

            const newReview = {
                name: document.getElementById('rev_name').value,
                rating: parseInt(document.getElementById('rev_rating').value),
                text: document.getElementById('rev_text').value,
                source: 'direct',
                avatar_letter: document.getElementById('rev_name').value.charAt(0).toUpperCase(),
                is_published: false // Needs admin approval
            };

            const { error } = await supabaseClient.from('testimonials').insert([newReview]);

            if (error) {
                status.style.color = 'var(--danger)';
                status.innerText = 'Error submitting review. Please try again.';
                btn.disabled = false;
            } else {
                status.style.color = 'var(--success)';
                status.innerText = 'Review submitted! It will appear once approved by the clinic.';
                reviewForm.reset();
                btn.disabled = false;
            }
        });
    }

    // Execute loaders
    await Promise.all([loadSiteSettings(), loadCases(), loadReviews()]);
});
