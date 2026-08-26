#!/bin/bash
# Rebuilds all pages from _src/ partials. Edit _src/*.body.html, header.html, footer.html, then run ./build.sh
cd "$(dirname "$0")"
build () {
	cat > "$1.html" <<EOF
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>$2</title>
<meta name="description" content="$3">
<link rel="icon" type="image/png" href="assets/brand/butterfly-badge.png">
<meta property="og:title" content="$2">
<meta property="og:description" content="$3">
<meta property="og:image" content="assets/img/case-2.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT@0,9..144,300..700,50;1,9..144,300..700,50&family=Manrope:wght@400;500;600;700&display=swap">
<link rel="stylesheet" href="css/styles.css">
</head>
<body>
$(cat _src/header.html)
$(cat _src/$1.body.html)
$(cat _src/footer.html)
</body>
</html>
EOF
}
build index "Amy Sindicic | Career Strategist for Government & Military Leaders" "From mission-driven to market-ready. Amy Sindicic helps government and military professionals transition into private-sector leadership roles with executive résumés, LinkedIn positioning and interview strategy."
build services "Services & Programs | Amy Sindicic" "Executive Career Direction (\$149), Executive Positioning & Branding (\$249) and the Complete Executive Transition (\$599) — one-to-one with career strategist Amy Sindicic."
build about "About Amy Sindicic | Career Strategist" "Why government workers trust Amy: certified career coach, résumé writer and interview coach with a Master's in Marketing and clients on four continents."
build case-studies "Case Studies | Amy Sindicic" "Real transitions from GS-15 to SES, GS-14 to executive leadership, and military service to senior leadership."
build resources "Free Resources & Résumé Library | Amy Sindicic" "Free private-sector résumé template, executive résumé samples, SES sample materials, interview guides and LinkedIn checklists."
build blog "Blog | Amy Sindicic" "Essays and case studies on executive hiring, positioning and the government-to-private-sector transition."
build contact "Book a Discovery Call | Amy Sindicic" "Schedule a complimentary consultation with career strategist Amy Sindicic."
echo "built"
