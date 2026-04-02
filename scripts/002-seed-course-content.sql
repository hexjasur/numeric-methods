-- Seed AI course context with Sonli Usullar (Numerical Methods) content

INSERT INTO ai_course_context (section_name, method_name, description, formula, example, content) VALUES

-- Iteratsiya (Iteration) Method
('Iteratsiya Usuli', 'Iteratsiya', 
'Iteratsiya usuli - bu tenglamaning ildizini topish uchun takroriy hisob-kitoblar orqali taxmin qiymatlarni yangilash usuli. Bu usul oddiy iteratsiya (simple iteration) va o''zgartirilgan iteratsiya (modified iteration) turlari mavjud.',
'x_{n+1} = φ(x_n), |φ''(x)| < 1',
'x^3 - 2x - 5 = 0 tenglamaning x = 2.09... ildizini topish',
'Iteratsiya usuli (takomillashtirilgan iteratsiya usuli) - bu iteratsiya jarayonida x_{n+1} = φ(x_n) formulasidan foydalanib ildizga yaqinlashamiz. Konvergentsiya uchun |φ''(x)| < 1 shart zarur.'),

-- Bisection (Half-division) Method
('Bisektsiya Usuli', 'Bisektsiya', 
'Bisektsiya usuli - bu kesmani ikkiga bo''lish orqali tenglamaning ildizini topish usuli. Bu usul har doim yaqinlasharli va oson tadbiqdagi usul.',
'x_{n} = (a_{n} + b_{n}) / 2',
'f(x) = x^3 - 2x - 5 = 0, [2, 3] kesmada ildiz bor',
'Bisektsiya usuli: agar f(a) * f(c) < 0 bo''lsa ildiz [a, c] da, aks holda [c, b] da. Jarayonni 10 marta takrorlash ≈ 1/1024 aniqligini beradi.'),

-- Nyuton (Newton) Method
('Nyuton Usuli', 'Nyuton', 
'Nyuton usuli (tangens usuli) - bu f(x) = 0 tenglamaning ildizini topish uchun eng tez yaqinlashadigan usul. U har bir nuqtada urinma chiziq chizib ildizga yaqinlashadi.',
'x_{n+1} = x_n - f(x_n) / f''(x_n)',
'f(x) = x^3 - 2x - 5, f''(x) = 3x^2 - 2, x_0 = 2',
'Nyuton usuli kvadrat yaqinlashuvga ega, ya''ni xatosi har bir qadamda kvadratik ravishda kamayadi. Lekin f''(x) ≠ 0 bo''lishi zarur.'),

-- Lagranj Interpolyatsiyasi
('Lagranj Interpolyatsiyasi', 'Lagranj', 
'Lagranj interpolyatsiyasi - bu berilgan nuqtalar orqali ko''p hadli funksiyani quradigan usul. Bu usul Lagranj polinomini ishlatadi.',
'L(x) = Σ y_i * l_i(x), l_i(x) = Π (x - x_j) / (x_i - x_j)',
'Nuqtalar: (1,1), (2,4), (3,9) orqali parabola qurish',
'Lagranj interpolyatsiyasi - bu berilgan (x_0, y_0), (x_1, y_1), ..., (x_n, y_n) nuqtalardan o''tuvchi n-darajali ko''p hadli topish usuli.'),

-- Simpson formulasi
('Simpson Formulasi', 'Simpson', 
'Simpson formulasi - bu Rimanni integralini taqribiy hisoblash uchun ishlatiladigan usul. Parabola bilan bo''ladi.',
'∫f(x)dx ≈ (h/3) * (f(x_0) + 4*f(x_1) + 2*f(x_2) + ... + f(x_n))',
'∫_0^1 sin(x) dx ni Simpson formulasi bilan hisoblash',
'Simpson formulasi - bu integralni parabolalar yordamida taqribiy hisoblash usuli. U Trapezoid usuldan aniqroq natija beradi.'),

-- Trapezoid usuli
('Trapezoid Usuli', 'Trapezoid', 
'Trapezoid usuli - bu integralni hisoblash uchun trapezoid shatirlardan foydalanuvchi usul.',
'∫f(x)dx ≈ (h/2) * (f(x_0) + 2*f(x_1) + 2*f(x_2) + ... + f(x_n))',
'∫_0^1 e^x dx ni Trapezoid usuli bilan hisoblash',
'Trapezoid usuli - bu integralni hisoblash uchun eng oddiy usul. Kichik qadamlar uchun aniqlik yetarli bo''ladi.');

-- Insert general content about numerical methods
INSERT INTO ai_course_context (section_name, content) VALUES

('Sonli Usullar Tavsifi', 
'Sonli usullar - bu matematik tenglamalarni yechish uchun hisoblash sharoitida takomillashtirilgan metodlar. Sonli analiz - bu ko''p murakkab masalalarni echish uchun samarali vositalarni taqdim etadi. Asosiy usullar: iteratsiya, bisektsiya, Nyuton, Lagranj interpolyatsiyasi, Simpson, Trapezoid va boshqalar.'),

('Aniqlik va Konvergentsiya', 
'Sonli usullarning samaradorligi aniqlik (accuracy) va konvergentsiya (convergence) ga bog''liq. Aniqlik - bu tahmini yechimning to''g''ri javobdan farqi. Konvergentsiya - bu iteratsiya jarayonining yechimga yaqinlashiши. Yaqqol konvergentsiyang bir usul boshqa usuldan tezroq yechimga yetib boradi.');
