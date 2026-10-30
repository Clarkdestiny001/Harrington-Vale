/* ============================================
   HARRINGTON & VALE - JAVASCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {

    // ---- Sticky Header ----
    const header = document.getElementById('header');
    let lastScroll = 0;

    function updateHeader() {
        const currentScroll = window.scrollY;
        if (currentScroll > 80) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    }

    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader();

    // ---- Mobile Hamburger Menu ----
    const hamburger = document.getElementById('hamburger');
    const mainNav = document.getElementById('mainNav');

    hamburger.addEventListener('click', function() {
        const isOpen = mainNav.classList.toggle('open');
        hamburger.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close mobile menu on nav link click
    mainNav.querySelectorAll('a').forEach(function(link) {
        link.addEventListener('click', function() {
            mainNav.classList.remove('open');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });

    // ---- Scroll Reveal Animations ----
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(function(el) {
        revealObserver.observe(el);
    });

    // Staggered reveal for groups
    function staggerReveal(parentSelector, childSelector, delayIncrement) {
        const parents = document.querySelectorAll(parentSelector);
        parents.forEach(function(parent) {
            const children = parent.querySelectorAll(childSelector);
            children.forEach(function(child, index) {
                child.style.transitionDelay = (index * delayIncrement) + 's';
            });
        });
    }

    staggerReveal('.practice-list', '.practice-item', 0.08);
    staggerReveal('.principles-grid', '.principle', 0.1);
    staggerReveal('.attorneys-grid', '.attorney-profile', 0.1);
    staggerReveal('.matters-list', '.matter', 0.1);
    staggerReveal('.insights-grid', '.insight-card', 0.1);
    staggerReveal('.offices-grid', '.office', 0.1);

    // ---- Smooth Scroll for Anchor Links ----
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerHeight = header.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ---- Contact Form Handling (real Netlify Forms submission) ----
    const form = document.getElementById('consultationForm');
    const formStatus = document.getElementById('formStatus');

    function setFieldError(fieldId, errorId, message) {
        const field = document.getElementById(fieldId);
        const errorEl = document.getElementById(errorId);
        if (message) {
            field.setAttribute('aria-invalid', 'true');
            field.classList.add('has-error');
            if (errorEl) errorEl.textContent = message;
        } else {
            field.removeAttribute('aria-invalid');
            field.classList.remove('has-error');
            if (errorEl) errorEl.textContent = '';
        }
    }

    function validateForm() {
        const fullName = document.getElementById('fullName').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        let isValid = true;

        if (!fullName) {
            setFieldError('fullName', 'fullNameError', 'Please enter your full name.');
            isValid = false;
        } else {
            setFieldError('fullName', 'fullNameError', '');
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailPattern.test(email)) {
            setFieldError('email', 'emailError', 'Please enter a valid email address.');
            isValid = false;
        } else {
            setFieldError('email', 'emailError', '');
        }

        if (!message) {
            setFieldError('message', 'messageError', 'Please add a short message.');
            isValid = false;
        } else {
            setFieldError('message', 'messageError', '');
        }

        return isValid;
    }

    function encodeFormData(formEl) {
        const data = new FormData(formEl);
        return Array.from(data.entries())
            .map(function(pair) {
                return encodeURIComponent(pair[0]) + '=' + encodeURIComponent(pair[1]);
            })
            .join('&');
    }

    function showStatus(message, type) {
        formStatus.textContent = message;
        formStatus.hidden = false;
        formStatus.className = 'form-status form-status-' + type;
    }

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            if (!validateForm()) {
                showStatus('Please correct the highlighted fields and try again.', 'error');
                return;
            }

            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Submitting…';
            submitBtn.disabled = true;
            showStatus('', 'pending');
            formStatus.hidden = true;

            fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: encodeFormData(form)
            })
                .then(function(response) {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    submitBtn.textContent = 'Request Submitted';
                    showStatus('Thank you. Your request has been received. A member of our team will be in touch shortly.', 'success');
                    form.reset();
                    setTimeout(function() {
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                    }, 3000);
                })
                .catch(function() {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    showStatus('Something went wrong and your request could not be sent. Please email us directly at enquiries@harringtonvale.com.', 'error');
                });
        });

        // Clear error states on input
        form.querySelectorAll('input, textarea, select').forEach(function(field) {
            field.addEventListener('input', function() {
                this.removeAttribute('aria-invalid');
                this.classList.remove('has-error');
            });
        });
    }

    // ---- Article Modal ----
    const articles = {
        'commercial-agreements': {
            category: 'Commercial',
            title: 'Navigating Complex Commercial Agreements',
            body: [
                'Commercial agreements increasingly need to balance two competing pressures: the desire for firm, enforceable commitments and the reality that commercial relationships evolve. Getting that balance right starts long before a contract is drafted, in how the parties define what success actually looks like.',
                'The strongest agreements are built around clear allocation of risk. Rather than attempting to anticipate every contingency, well-drafted agreements establish principles for how unanticipated issues should be resolved: who bears the cost of delay, how disputes are escalated, and under what circumstances a party may step away.',
                'Regulatory change is also reshaping how agreements are structured. Clients operating across borders need contracts that remain enforceable as local rules shift, which increasingly means building in periodic review mechanisms rather than treating a signed agreement as a fixed, static document.',
                'Ultimately, the objective is not simply a contract that survives legal scrutiny, but one that supports the commercial relationship it is meant to protect.'
            ]
        },
        'corporate-transactions': {
            category: 'Corporate',
            title: 'The Changing Landscape of Corporate Transactions',
            body: [
                'Corporate transactions today move through a materially more complex environment than a decade ago. Heightened regulatory scrutiny, more assertive antitrust enforcement, and growing attention to environmental and governance factors have all extended transaction timelines and raised the bar for diligence.',
                'For acquirers, this means diligence can no longer be treated as a purely financial and legal exercise. Understanding a target\'s regulatory exposure, supply chain resilience, and governance practices has become central to assessing whether a deal will close on the terms originally negotiated.',
                'Deal structuring has adapted accordingly. We are seeing more conditional structures, longer-dated regulatory covenants, and closer collaboration between legal, financial, and communications advisors from the earliest stages of a transaction.',
                'The firms and advisors succeeding in this environment are those treating regulatory and governance considerations as strategic inputs, not late-stage compliance checks.'
            ]
        },
        'ip-digital-economy': {
            category: 'Technology',
            title: 'Protecting Intellectual Property in a Digital Economy',
            body: [
                'As business models increasingly depend on data, software, and digital platforms, intellectual property strategy has moved from a legal afterthought to a core commercial consideration. The assets most in need of protection are often intangible, and the threats they face evolve faster than traditional filing strategies can keep pace with.',
                'Effective IP strategy today combines classic tools: patents, trademarks, and carefully drafted licensing terms, with a clear-eyed view of how a business actually creates value. That means understanding which innovations are genuinely defensible, and which are better protected through trade secret practices, contractual terms, and internal controls.',
                'Enforcement, too, looks different across borders and platforms. A strategy that works in one jurisdiction may offer little practical protection in another, which makes coordinated, multi-jurisdictional planning essential for any business operating at scale.',
                'The businesses that treat IP as a strategic asset, rather than a defensive filing exercise, are generally the ones best positioned to capture the value of their own innovation.'
            ]
        },
        'commercial-disputes': {
            category: 'Disputes',
            title: 'Strategic Considerations in Commercial Disputes',
            body: [
                'When a commercial relationship breaks down, the instinct is often to focus immediately on legal merit. In practice, the more consequential early decisions are strategic: what outcome actually serves the client\'s interests, and what path is most likely to achieve it with the least commercial disruption.',
                'Litigation risk is rarely just about the strength of a claim. Cost, timeline, reputational exposure, and the ongoing commercial relationship between the parties all factor into whether litigation, arbitration, or a negotiated resolution is the right approach.',
                'Alternative dispute resolution mechanisms have become increasingly central to this calculus, offering greater confidentiality and, often, a faster path to resolution than court proceedings, though they are not the right tool for every dispute.',
                'The disputes handled most effectively are typically those where legal strategy and commercial judgment are treated as inseparable from the outset, rather than sequential considerations.'
            ]
        }
    };

    const articleModal = document.getElementById('articleModal');
    const articleModalCategory = document.getElementById('articleModalCategory');
    const articleModalTitle = document.getElementById('articleModalTitle');
    const articleModalBody = document.getElementById('articleModalBody');
    let lastFocusedElement = null;

    function openArticleModal(slug) {
        const article = articles[slug];
        if (!article || !articleModal) return;

        lastFocusedElement = document.activeElement;
        articleModalCategory.textContent = article.category;
        articleModalTitle.textContent = article.title;
        articleModalBody.innerHTML = article.body.map(function(p) {
            return '<p>' + p + '</p>';
        }).join('');

        articleModal.hidden = false;
        document.body.style.overflow = 'hidden';
        articleModal.querySelector('.article-modal-close').focus();
    }

    function closeArticleModal() {
        if (!articleModal) return;
        articleModal.hidden = true;
        document.body.style.overflow = '';
        if (lastFocusedElement) lastFocusedElement.focus();
    }

    document.querySelectorAll('[data-article]').forEach(function(btn) {
        btn.addEventListener('click', function() {
            openArticleModal(this.getAttribute('data-article'));
        });
    });

    if (articleModal) {
        articleModal.querySelectorAll('[data-close-modal]').forEach(function(el) {
            el.addEventListener('click', closeArticleModal);
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && !articleModal.hidden) {
                closeArticleModal();
            }
        });
    }

    // ---- Footer Year ----
    const yearEl = document.getElementById('currentYear');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // ---- Parallax Effect on Hero Image ----
    const heroImage = document.querySelector('.hero-image img');
    if (heroImage && window.innerWidth > 768) {
        window.addEventListener('scroll', function() {
            const scrollY = window.scrollY;
            const heroHeight = document.querySelector('.hero').offsetHeight;
            if (scrollY < heroHeight) {
                heroImage.style.transform = 'translateY(' + (scrollY * 0.15) + 'px) scale(1.05)';
            }
        }, { passive: true });
    }

    // ---- Practice Area Accordion (Mobile) ----
    const practiceItems = document.querySelectorAll('.practice-item');
    practiceItems.forEach(function(item) {
        item.addEventListener('click', function() {
            if (window.innerWidth <= 700) {
                const content = this.querySelector('.practice-content p');
                const isExpanded = content.style.maxHeight && content.style.maxHeight !== '0px';

                // Collapse all
                document.querySelectorAll('.practice-content p').forEach(function(p) {
                    p.style.maxHeight = '0px';
                    p.style.opacity = '0';
                    p.style.marginTop = '0';
                    p.style.overflow = 'hidden';
                    p.style.transition = 'all 0.35s ease';
                });

                if (!isExpanded) {
                    content.style.maxHeight = content.scrollHeight + 'px';
                    content.style.opacity = '1';
                    content.style.marginTop = '0.5rem';
                }
            }
        });
    });

    // Initialize practice descriptions as collapsed on mobile
    function initPracticeAccordion() {
        if (window.innerWidth <= 700) {
            document.querySelectorAll('.practice-content p').forEach(function(p) {
                p.style.maxHeight = '0px';
                p.style.opacity = '0';
                p.style.overflow = 'hidden';
                p.style.transition = 'all 0.35s ease';
            });
        } else {
            document.querySelectorAll('.practice-content p').forEach(function(p) {
                p.style.maxHeight = '';
                p.style.opacity = '';
                p.style.overflow = '';
                p.style.transition = '';
                p.style.marginTop = '';
            });
        }
    }

    initPracticeAccordion();
    window.addEventListener('resize', initPracticeAccordion);

});
