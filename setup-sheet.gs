/**
 * SheetSite — Google Apps Script Setup
 *
 * HOW TO USE:
 * 1. Go to https://script.google.com
 * 2. Create a new project
 * 3. Paste this entire script
 * 4. Click Run → setupSheetSite
 * 5. Authorize when prompted
 * 6. The script will log the Spreadsheet ID — copy it to your .env file
 * 7. Share the spreadsheet: File → Share → Anyone with the link → Viewer
 */

function setupSheetSite() {
  var ss = SpreadsheetApp.create("SheetSite Demo");
  var id = ss.getId();

  // Remove default "Sheet1"
  var defaultSheet = ss.getSheetByName("Sheet1");

  // --- _config ---
  var configSheet = ss.insertSheet("_config");
  configSheet.appendRow(["key", "value"]);
  configSheet.appendRow(["site_name", "SheetSite Demo"]);
  configSheet.appendRow(["site_description", "Landing pages powered by Google Sheets"]);
  configSheet.appendRow(["nav_logo_url", ""]);
  configSheet.appendRow(["footer_text", "&copy; 2026 SheetSite Demo. All rights reserved."]);

  // --- _nav ---
  var navSheet = ss.insertSheet("_nav");
  navSheet.appendRow(["label", "href", "order"]);
  navSheet.appendRow(["Home", "/", "1"]);
  navSheet.appendRow(["About", "/about", "2"]);
  navSheet.appendRow(["Our Team", "/team", "3"]);
  navSheet.appendRow(["Contact", "/contact", "4"]);

  // --- _pages ---
  var pagesSheet = ss.insertSheet("_pages");
  pagesSheet.appendRow(["slug", "title", "meta_description", "template"]);
  pagesSheet.appendRow(["home", "Welcome to SheetSite", "A demo of Astro + Google Sheets", "landing"]);
  pagesSheet.appendRow(["about", "About Us", "Learn about our mission", "landing"]);
  pagesSheet.appendRow(["team", "Our Team", "Meet our professionals", "directory"]);
  pagesSheet.appendRow(["contact", "Contact Us", "Get in touch with us", "landing"]);

  // --- home ---
  var homeSheet = ss.insertSheet("home");
  homeSheet.appendRow(["section_order", "section_type", "prop_key", "prop_value"]);
  // Hero
  homeSheet.appendRow(["1", "hero", "title", "Build Landing Pages From Sheets"]);
  homeSheet.appendRow(["1", "hero", "subtitle", "No CMS required. Just edit a spreadsheet."]);
  homeSheet.appendRow(["1", "hero", "cta_text", "Get Started"]);
  homeSheet.appendRow(["1", "hero", "cta_link", "/contact"]);
  homeSheet.appendRow(["1", "hero", "bg_image", "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80"]);
  // Features
  homeSheet.appendRow(["2", "features", "title", "What We Offer"]);
  homeSheet.appendRow(["2", "features", "item_1_title", "Easy Updates"]);
  homeSheet.appendRow(["2", "features", "item_1_desc", "Edit a Google Sheet and your site updates automatically."]);
  homeSheet.appendRow(["2", "features", "item_2_title", "No CMS Needed"]);
  homeSheet.appendRow(["2", "features", "item_2_desc", "Skip WordPress. Skip logins. Just a spreadsheet."]);
  homeSheet.appendRow(["2", "features", "item_3_title", "Fast & Accessible"]);
  homeSheet.appendRow(["2", "features", "item_3_desc", "Static HTML pages that load instantly and meet ADA standards."]);
  // Testimonials
  homeSheet.appendRow(["3", "testimonials", "item_1_quote", "SheetSite saved us hours every week."]);
  homeSheet.appendRow(["3", "testimonials", "item_1_author", "Sarah Johnson"]);
  homeSheet.appendRow(["3", "testimonials", "item_1_role", "Marketing Director"]);
  homeSheet.appendRow(["3", "testimonials", "item_2_quote", "Our team updates content without any help from developers."]);
  homeSheet.appendRow(["3", "testimonials", "item_2_author", "Mike Chen"]);
  homeSheet.appendRow(["3", "testimonials", "item_2_role", "Content Manager"]);
  // CTA Banner
  homeSheet.appendRow(["4", "cta_banner", "title", "Ready to Try It?"]);
  homeSheet.appendRow(["4", "cta_banner", "subtitle", "See how simple content management can be."]);
  homeSheet.appendRow(["4", "cta_banner", "button_text", "Contact Us"]);
  homeSheet.appendRow(["4", "cta_banner", "button_link", "/contact"]);

  // --- about ---
  var aboutSheet = ss.insertSheet("about");
  aboutSheet.appendRow(["section_order", "section_type", "prop_key", "prop_value"]);
  // Hero
  aboutSheet.appendRow(["1", "hero", "title", "About SheetSite"]);
  aboutSheet.appendRow(["1", "hero", "subtitle", "Empowering marketing teams"]);
  // TextBlock
  aboutSheet.appendRow(["2", "text_block", "title", "Our Mission"]);
  aboutSheet.appendRow(["2", "text_block", "content", "We believe content management should be simple. No logins, no dashboards, no training. Just a spreadsheet your team already knows how to use."]);
  // ImageText
  aboutSheet.appendRow(["3", "image_text", "title", "How It Works"]);
  aboutSheet.appendRow(["3", "image_text", "content", "Marketing edits a Google Sheet. The site rebuilds automatically. New pages, updated copy, reordered sections — all from the spreadsheet."]);
  aboutSheet.appendRow(["3", "image_text", "image_url", "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80"]);
  aboutSheet.appendRow(["3", "image_text", "image_position", "right"]);
  // CTA Banner
  aboutSheet.appendRow(["4", "cta_banner", "title", "Want to Learn More?"]);
  aboutSheet.appendRow(["4", "cta_banner", "button_text", "Contact Us"]);
  aboutSheet.appendRow(["4", "cta_banner", "button_link", "/contact"]);

  // --- team ---
  var teamSheet = ss.insertSheet("team");
  teamSheet.appendRow(["section_order", "section_type", "prop_key", "prop_value"]);
  // Hero
  teamSheet.appendRow(["1", "hero", "title", "Meet Our Team"]);
  teamSheet.appendRow(["1", "hero", "subtitle", "Professionals you can trust"]);
  // Directory header
  teamSheet.appendRow(["2", "directory_header", "title", "Our Specialists"]);
  teamSheet.appendRow(["2", "directory_header", "filter_by", "specialty"]);
  // Directory items
  teamSheet.appendRow(["3", "directory_item", "name", "Jane Smith"]);
  teamSheet.appendRow(["3", "directory_item", "role", "Senior Consultant"]);
  teamSheet.appendRow(["3", "directory_item", "specialty", "Finance"]);
  teamSheet.appendRow(["3", "directory_item", "image_url", "https://i.pravatar.cc/300?u=jane"]);
  teamSheet.appendRow(["3", "directory_item", "bio", "Expert in financial strategy with 15 years of experience."]);

  teamSheet.appendRow(["4", "directory_item", "name", "John Doe"]);
  teamSheet.appendRow(["4", "directory_item", "role", "Lead Analyst"]);
  teamSheet.appendRow(["4", "directory_item", "specialty", "Marketing"]);
  teamSheet.appendRow(["4", "directory_item", "image_url", "https://i.pravatar.cc/300?u=john"]);
  teamSheet.appendRow(["4", "directory_item", "bio", "Data-driven marketing specialist focused on growth."]);

  teamSheet.appendRow(["5", "directory_item", "name", "Emily Davis"]);
  teamSheet.appendRow(["5", "directory_item", "role", "Creative Director"]);
  teamSheet.appendRow(["5", "directory_item", "specialty", "Design"]);
  teamSheet.appendRow(["5", "directory_item", "image_url", "https://i.pravatar.cc/300?u=emily"]);
  teamSheet.appendRow(["5", "directory_item", "bio", "Award-winning designer with a passion for accessibility."]);

  // --- contact ---
  var contactSheet = ss.insertSheet("contact");
  contactSheet.appendRow(["section_order", "section_type", "prop_key", "prop_value"]);
  // Hero
  contactSheet.appendRow(["1", "hero", "title", "Get In Touch"]);
  contactSheet.appendRow(["1", "hero", "subtitle", "We would love to hear from you"]);
  // Form
  contactSheet.appendRow(["2", "form", "webhook_url", "https://hooks.zapier.com/hooks/catch/example"]);
  contactSheet.appendRow(["2", "form", "success_redirect", "/thank-you"]);
  contactSheet.appendRow(["2", "form", "submit_text", "Send Message"]);
  contactSheet.appendRow(["2", "form", "field_1_name", "full_name"]);
  contactSheet.appendRow(["2", "form", "field_1_type", "text"]);
  contactSheet.appendRow(["2", "form", "field_1_label", "Full Name"]);
  contactSheet.appendRow(["2", "form", "field_1_required", "true"]);
  contactSheet.appendRow(["2", "form", "field_1_pattern", "^[^\\s\\d]+ [^\\d]+"]);
  contactSheet.appendRow(["2", "form", "field_1_validation_message", "Please enter your first and last name"]);
  contactSheet.appendRow(["2", "form", "field_2_name", "email"]);
  contactSheet.appendRow(["2", "form", "field_2_type", "email"]);
  contactSheet.appendRow(["2", "form", "field_2_label", "Email Address"]);
  contactSheet.appendRow(["2", "form", "field_2_required", "true"]);
  contactSheet.appendRow(["2", "form", "field_3_name", "phone"]);
  contactSheet.appendRow(["2", "form", "field_3_type", "tel"]);
  contactSheet.appendRow(["2", "form", "field_3_label", "Phone Number"]);
  contactSheet.appendRow(["2", "form", "field_3_required", "false"]);
  contactSheet.appendRow(["2", "form", "field_4_name", "message"]);
  contactSheet.appendRow(["2", "form", "field_4_type", "textarea"]);
  contactSheet.appendRow(["2", "form", "field_4_label", "Your Message"]);
  contactSheet.appendRow(["2", "form", "field_4_required", "false"]);

  // Delete default sheet
  if (defaultSheet) {
    ss.deleteSheet(defaultSheet);
  }

  Logger.log("========================================");
  Logger.log("SheetSite spreadsheet created!");
  Logger.log("Spreadsheet ID: " + id);
  Logger.log("URL: https://docs.google.com/spreadsheets/d/" + id);
  Logger.log("========================================");
  Logger.log("");
  Logger.log("NEXT STEPS:");
  Logger.log("1. Open the URL above");
  Logger.log("2. Click Share → Anyone with the link → Viewer");
  Logger.log("3. Copy the ID above into your .env file:");
  Logger.log("   SPREADSHEET_ID=" + id);
}
