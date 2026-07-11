-- ============================================================
-- Seed data for Pet Health Companion
-- Breeds reference table — dogs and cats
-- ============================================================

insert into public.breeds (name, species, care_food, care_exercise, care_sleep, care_health_notes) values

-- ── Dogs ────────────────────────────────────────────────────
('Labrador Retriever', 'dog',
  'High-quality dry kibble formulated for large breeds; 2–3 cups twice daily. Avoid overfeeding — Labs are prone to obesity. Provide fresh water at all times.',
  '1–2 hours of vigorous daily exercise: fetch, swimming, or off-leash running. Mental stimulation through training sessions prevents destructive behavior.',
  '12–14 hours per day including naps. Provide a supportive orthopedic bed; large breeds benefit from joint cushioning.',
  'Prone to hip and elbow dysplasia; schedule annual OFA screenings. Watch for exercise-induced collapse (EIC) and obesity-related joint stress. Annual heartworm and flea/tick prevention required.'),

('Golden Retriever', 'dog',
  'Premium large-breed kibble, 2–3 cups twice daily, with glucosamine supplementation from age 5+. Avoid high-fat treats.',
  '1–2 hours daily: hiking, swimming, agility training. Off-leash play in fenced areas is ideal.',
  '12–14 hours per day. Goldens are heavy shedders — wash bedding weekly.',
  'Cancer rates are notably higher in the breed; annual wellness bloodwork is strongly recommended from age 6. Screen for sub-aortic stenosis and hip dysplasia.'),

('German Shepherd', 'dog',
  'High-protein large-breed formula, 3–4 cups split across two meals. Avoid bloat triggers: do not exercise 1 hour before or after meals.',
  '2+ hours daily; needs both physical outlets and problem-solving tasks. Excellent candidates for agility, Schutzhund, or nose-work sports.',
  '12–14 hours per day. Provide space and a consistent resting area.',
  'Degenerative myelopathy and hip dysplasia are breed-specific risks. Annual hip X-rays recommended. Watch for signs of bloat (GDV) — a veterinary emergency.'),

('French Bulldog', 'dog',
  'Small-breed kibble with limited corn/soy; 1–1.5 cups split into two meals. Portion-control strictly — weight gain worsens breathing.',
  '30–45 minutes of gentle daily activity; avoid high-intensity exercise. No outdoor activity in heat above 24 °C (75 °F).',
  '12–14 hours. Frenchies snore loudly — a normal trait, but sudden changes in breathing indicate veterinary review.',
  'Brachycephalic airway syndrome is common; consult your vet about surgical correction if breathing is labored. Monitor for IVDD (intervertebral disc disease) and skin-fold dermatitis.'),

('Bulldog', 'dog',
  'Breed-specific or small-breed formula, two measured meals daily. Elevated feeders can reduce air gulping.',
  '20–30 minutes of low-impact walking twice daily; keep sessions short in warm weather.',
  '12–14 hours. Bulldogs are champion nappers — provide a cool, well-ventilated space.',
  'Brachycephalic obstructive airway syndrome, hip dysplasia, and cherry eye are common. Annual cardiac and respiratory checkups recommended. Skin folds require weekly cleaning.'),

('Poodle', 'dog',
  'High-quality protein-first kibble matched to size (toy, miniature, or standard); meals twice daily. Avoid artificial additives.',
  'Standard: 1–2 hours daily; miniature/toy: 45–60 minutes. Poodles excel in agility and obedience.',
  '12–14 hours. Intelligent breeds are prone to anxiety without mental enrichment.',
  'Prone to progressive retinal atrophy, Addison''s disease, and bloat (standard). Regular eye exams and annual bloodwork recommended.'),

('Beagle', 'dog',
  'Measured portions of small-breed or all-breed kibble; two meals daily. Beagles are notorious scavengers — secure food storage.',
  '1–2 hours of active exercise daily, ideally with scent-tracking activities. Secure fencing essential — Beagles follow their nose.',
  '12–14 hours per day.',
  'Prone to epilepsy, hypothyroidism, and Musladin–Lueke syndrome. Regular weight monitoring; obesity is a frequent issue in the breed.'),

('Rottweiler', 'dog',
  'Large-breed high-protein kibble, 4–5 cups split across two meals. Joint supplements (glucosamine, fish oil) from age 4+.',
  '2+ hours daily: strength-building walks, pulling sports, protection work, or fetch.',
  '12–14 hours. Provide a large orthopedic bed.',
  'Hip and elbow dysplasia, dilated cardiomyopathy, and osteosarcoma are breed concerns. Annual cardiac auscultation from age 4; OFA hip and elbow evaluations recommended.'),

('Yorkshire Terrier', 'dog',
  'Small-breed dry kibble, 0.5 cup split into two meals. Dental health kibble or regular brushing is essential — small jaws mean crowded teeth.',
  '30 minutes of daily exercise; indoor play and short walks suffice.',
  '13–15 hours per day.',
  'Tracheal collapse, luxating patella, and portosystemic shunts are breed-specific concerns. Dental cleanings every 12 months due to crowded dentition.'),

('Dachshund', 'dog',
  'Small-breed kibble, 0.5–1 cup twice daily. Strict weight management — extra weight multiplies spinal load.',
  '30–45 minutes daily; avoid stairs and jumping. Use ramps for furniture access.',
  '12–14 hours. Firm, supportive bedding protects the spine.',
  'Intervertebral disc disease (IVDD) is the primary breed concern. Avoid activities with high spinal impact. Annual spinal assessments from age 3 in affected lines.'),

('Siberian Husky', 'dog',
  'High-calorie performance kibble in winter; reduce portions in summer — Huskies self-regulate but portion control prevents bloat.',
  '2+ hours daily of vigorous activity: running, hiking, sledding, or off-leash in a securely fenced area.',
  '12–14 hours. Provide cool sleeping areas; Huskies tolerate cold better than heat.',
  'Progressive retinal atrophy, hip dysplasia, and zinc-responsive dermatosis are breed concerns. Annual eye and joint screenings recommended.'),

('Shih Tzu', 'dog',
  'Small-breed kibble, 0.5–1 cup split twice daily. Elevated bowl reduces brachycephalic strain during eating.',
  '20–30 minutes of gentle daily play; low-impact walks suit the breed well.',
  '14–16 hours per day.',
  'Brachycephalic airway syndrome, eye ulcers (prominent eyes), and hip dysplasia noted in breed lines. Weekly eye cleaning and monthly ear checks required.'),

('Doberman Pinscher', 'dog',
  'Large-breed high-protein kibble, 3–4 cups daily split across two meals. Taurine/L-carnitine supplementation discussed with vet from age 5.',
  '1.5–2 hours daily of vigorous activity; Dobermans excel in protection sports and agility.',
  '12–14 hours per day.',
  'Dilated cardiomyopathy (DCM) is the leading health concern — annual Holter monitoring from age 3. Von Willebrand disease (bleeding disorder) testing recommended before surgery. Wobbler syndrome also noted.'),

('Border Collie', 'dog',
  'High-protein active-breed kibble, 1.5–2 cups twice daily. Adjust portions to activity level — working dogs need more.',
  '2+ hours daily minimum; needs a job to do (herding, agility, flyball) or mental stimulation every day.',
  '12–14 hours. Under-exercised Border Collies are prone to destructive behavior.',
  'Collie eye anomaly and progressive retinal atrophy are genetic concerns. Annual eye exams recommended. MDR1 gene mutation — test before administering certain drugs including ivermectin.'),

('Maltese', 'dog',
  'Small-breed kibble, 0.25–0.5 cup split twice daily. Dental kibble beneficial given small jaw size.',
  '20–30 minutes of daily play; indoor activity often sufficient.',
  '14–16 hours per day.',
  'Luxating patella, tracheal collapse, and dental disease are common. Tear-stain management (regular eye wiping) and monthly ear checks recommended.'),

('Chihuahua', 'dog',
  'Toy-breed kibble, 0.25–0.5 cup split into three small meals daily. Small stomachs mean little and often.',
  '20–30 minutes of daily exercise; indoor play and short walks are sufficient.',
  '14–16 hours per day.',
  'Hypoglycemia risk in puppies; monitor for lethargy. Luxating patella, tracheal collapse, and dental overcrowding are frequent concerns. Annual dental cleanings essential.'),

('Pomeranian', 'dog',
  'Toy-breed or small-breed kibble, 0.25–0.5 cup split twice daily.',
  '30 minutes of daily exercise; indoor play plus short outdoor walks.',
  '14–16 hours per day.',
  'Luxating patella, tracheal collapse, and alopecia X (black skin disease) are breed concerns. Regular dental cleanings due to overcrowding.'),

('Boxer', 'dog',
  'Large-breed high-protein kibble, 3 cups split twice daily. Avoid feeding right before or after exercise to reduce bloat risk.',
  '1.5–2 hours daily; vigorous play, fetch, and running suit the breed.',
  '12–14 hours per day.',
  'Heart conditions (aortic stenosis, arrhythmogenic right ventricular cardiomyopathy) and cancer are primary concerns. Annual cardiac and oncology screenings from age 5 recommended.'),

('Australian Shepherd', 'dog',
  'Active-breed high-protein kibble, 1.5–2.5 cups split twice daily.',
  '1.5–2 hours daily; herding sports, agility, or frisbee provide the intensity Aussies need.',
  '12–14 hours per day.',
  'MDR1 gene mutation (drug sensitivity) — test before treatment with certain antiparasitic medications. Collie eye anomaly, epilepsy, and hip dysplasia are breed-specific concerns.'),

-- ── Cats ────────────────────────────────────────────────────
('Persian', 'cat',
  'High-quality wet food and breed-specific dry kibble; wet food supports kidney hydration. Two meals daily; free-feeding dry food is acceptable for adults at healthy weight.',
  'Short play sessions 10–15 minutes twice daily with wand toys; Persians are low-energy but need stimulation to prevent obesity.',
  '15–20 hours per day; provide soft, elevated resting spots.',
  'Brachycephalic airway issues and polycystic kidney disease (PKD) are the primary concerns. DNA testing for PKD recommended. Daily facial-fold cleaning and weekly ear checks required.'),

('Maine Coon', 'cat',
  'High-protein wet and dry food for large breeds; 2–3 meals daily. Taurine must be present in food. Large breed kibble is preferred for dental benefit.',
  '20–30 minutes of active play twice daily; puzzle feeders support mental stimulation.',
  '15–20 hours per day.',
  'Hypertrophic cardiomyopathy (HCM) is the primary genetic concern — annual cardiac screening by echocardiogram from age 3. Spinal muscular atrophy and hip dysplasia also noted.'),

('Siamese', 'cat',
  'High-protein wet and dry food; 2 measured meals daily. Siamese are prone to obesity in middle age.',
  '20–30 minutes of interactive play twice daily; highly social — benefits from enrichment and a feline companion.',
  '15–18 hours per day.',
  'Dental disease, amyloidosis (liver), and mediastinal lymphoma are breed-specific risks. Annual bloodwork from age 7 recommended. Progressive retinal atrophy noted in some lines.'),

('Bengal', 'cat',
  'High-protein diet; raw or grain-free food is well-suited to the breed. Two meals daily with careful portion control.',
  '30–45 minutes of vigorous interactive play daily. Bengals need environmental enrichment: climbing walls, puzzle feeders, and supervised outdoor time.',
  '15–18 hours per day.',
  'Progressive retinal atrophy (PRA-b) is a known genetic issue. Flat-chested kitten syndrome is possible in litters. Annual wellness exams recommended.'),

('Ragdoll', 'cat',
  'High-quality wet and dry food matched to life stage; two meals daily. Ragdolls are slow to mature — use kitten food until 18 months.',
  '15–20 minutes of gentle interactive play twice daily; Ragdolls are calm but enjoy feather wands and laser toys.',
  '15–20 hours per day. Ragdolls go limp when held (floppy trait) — always support hindquarters.',
  'Hypertrophic cardiomyopathy (HCM) and polycystic kidney disease (PKD) are primary genetic concerns. Annual cardiac echo from age 3. Bladder stones also documented in the breed.'),

('Scottish Fold', 'cat',
  'High-protein wet and dry food, two measured meals daily. Joint-supporting supplements (omega-3) beneficial.',
  '15–20 minutes of gentle play twice daily. Due to joint issues, avoid high-impact jumping activities.',
  '15–18 hours per day. Provide low-entry resting spots to reduce joint stress.',
  'Osteochondrodysplasia — a progressive, painful joint condition — affects all true folds. Regular pain assessment and veterinary monitoring every 6 months are essential. Hypertrophic cardiomyopathy also noted.'),

('Sphynx', 'cat',
  'High-calorie food (more meals or larger portions) due to elevated metabolism from lack of fur; 3 meals daily or free-feed dry food. Wet food essential for kidney hydration.',
  '20–30 minutes of active play twice daily; Sphynx cats are energetic and thrive on interaction.',
  '14–18 hours per day. Provide warm bedding or cat sweaters — Sphynx cats lose body heat quickly.',
  'Hypertrophic cardiomyopathy (HCM) is common — annual echocardiogram strongly recommended. Hereditary myopathy noted in some lines. Weekly bathing required to remove skin oils.'),

('British Shorthair', 'cat',
  'High-protein wet and dry food; two measured meals daily. Portion control is critical — British Shorthairs are prone to obesity.',
  '20–30 minutes of interactive play twice daily. They are calm but enjoy short bursts of activity.',
  '15–20 hours per day.',
  'Hypertrophic cardiomyopathy (HCM) and polycystic kidney disease (PKD) are primary concerns. Annual cardiac and kidney screenings recommended from age 5.'),

('Abyssinian', 'cat',
  'High-protein wet and dry food; two meals daily. Active metabolism — adjust portions seasonally.',
  '30–45 minutes of vigorous interactive play daily. Abyssinians need vertical space: tall cat trees and wall shelves.',
  '14–16 hours per day.',
  'Progressive retinal atrophy (rdAc-PRA) and pyruvate kinase deficiency are genetic concerns — DNA testing available. Renal amyloidosis reported in some lines. Annual wellness exams recommended.'),

('Norwegian Forest Cat', 'cat',
  'High-protein wet and dry food for large breeds; two meals daily.',
  '20–30 minutes of climbing and play twice daily; access to a tall cat tree is essential.',
  '15–18 hours per day.',
  'Hypertrophic cardiomyopathy (HCM) and glycogen storage disease type IV (GSD IV) are genetic concerns. DNA test for GSD IV prior to breeding. Annual cardiac screening from age 3.'),

('Russian Blue', 'cat',
  'High-quality protein-first wet and dry food; two meals daily with strict portion control — Russian Blues are prone to overeating.',
  '20 minutes of interactive play twice daily; wand toys and puzzle feeders work well.',
  '15–18 hours per day.',
  'Generally a robust breed with few genetic predispositions. Monitor weight closely; obesity can lead to secondary joint and kidney issues. Annual wellness bloodwork from age 7.'),

('Birman', 'cat',
  'High-quality wet and dry food; two meals daily.',
  '20–30 minutes of gentle interactive play twice daily.',
  '15–18 hours per day.',
  'Congenital hypotrichosis and Spongiform degeneration are rare but documented. Hypertrophic cardiomyopathy reported. Annual cardiac screening recommended from age 5.'),

('Devon Rex', 'cat',
  'High-calorie food; Devon Rex cats have elevated metabolisms and can be fed three times daily or have access to dry kibble. Wet food for hydration.',
  '20–30 minutes of active interactive play daily. Devon Rex cats are playful and mischievous.',
  '14–16 hours per day. Provide warm bedding.',
  'Hereditary myopathy (Devon Rex myopathy) causes progressive muscle weakness — genetic testing available. Hypertrophic cardiomyopathy also noted. Annual cardiac assessment recommended.'),

('Turkish Angora', 'cat',
  'High-protein wet and dry food; two meals daily.',
  '20–30 minutes of active play twice daily; Turkish Angoras are energetic and enjoy climbing.',
  '14–16 hours per day.',
  'White cats with blue eyes may carry deafness genes — hearing test (BAER) recommended for white kittens. Hypertrophic cardiomyopathy documented. Annual wellness exams advised.'),

('Burmese', 'cat',
  'High-protein wet and dry food; two to three meals daily. Burmese cats are social eaters — avoid free-feeding to prevent overeating.',
  '20–30 minutes of vigorous interactive play twice daily; Burmese are athletic and enjoy fetch.',
  '14–16 hours per day.',
  'Head defect (craniofacial abnormality) is a genetic risk in the breed. Hypokalaemia (low potassium) and diabetes mellitus are documented. Annual wellness bloodwork recommended from age 5.');
