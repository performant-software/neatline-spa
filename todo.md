# Releases

## Version 0.5
- Exhibits are reliable associated to particular sites.
- Existing fields for Neatline records are visible, editable, and working.
    - Beth notes that the WMS address and tiles are not working.
- Working installation from a ZIP file (no need to run any commands)

## Version 0.6
- Successful import/link of Omeka Items to Neatline Record.
- Simple search for a place name, to pan to that part of the map

## Version 0.7
- A working timeline....

# Wishlist
- Support for WMTS.
- Reliably recognize placenames in certain Omeka Item DC fields (e.g. Coverage)

# Issues

## Exhibit Editor Settings
- Narrative field requires wysiwyg editor with html source option for NeatlineText component: #147

## Map Exhibits:
- Add map controls for setting a default focus, default zoom for exhibit #157
- Add settings for restricted map extent, min + max map zoom levels #148
- Fields exist but do they work # need more info
- Base Layer: Custom: Tile Layer # need more info -- other than WMS?
- Base Layer: Custom: WMS Layer #155
- Ability to make/save changes to exhibit settings after initial creation. Includes all settings, esp. ability to re-set Base Layer, add/remove Additional Layers, change public setting #170

## Image Exhibits:
- Add settings for default zoom level, min/max zoom levels # dupe of # 148/157?

## Plugin Settings (when NeatlineText, timeline components included)
- Setting to toggle on/off timeline #85
- Setting to toggle on/off NeatlineText #85
- (timeline will possibly offer settings comparable to current timeline, incld. span/track heights, tbd) # need more info on priority

## Record Editor Settings:
- Link to Omeka Item option, should autofill Title from Item metadata, if record Title field empty, (also other fields if possible). #156
- Record Title and Body require wysiwyg editor with html source option #171 title too?
- Editing map geometries after initial record creation is buggy (going back later to add more/change geo). #172
- Point Radius/Point Image not used since default is Leaflet marker - do we want a point option available? # need more info
- Need circle draw tool #94
- Need option similar to Point Image - url source for custom marker image # priority?
- WMS Address/Layers fields exist but don’t work #10 and #155
- Option to enter SVG markup # priority?
- Option to enter raw vector geometry data # priority?
- Need settings for default focus/default zoom, min/max zoom (Record visibility defaults should be exhibit setting defaults unless specified in these fields) #157, #148
- Option to turn off/on pop-up bubble for record # priority?
- Option to include/not include record on timeline # priority?
- Date fields will need to coordinate with Timeline component, tbd  # priority?
- Tags field - with some equivalent to Neatline Stylesheets in Exhibit Settings (https://neatline.org/docs/neatline-stylesheets/)  # priority?
- URL Slug field - what is the intention of this? If like Slug field in Neatline Classic, needs to work with NeatlineText component (https://neatline.org/docs/working-with-the-text-widget/#step-1-create-the-neatline-records)  # priority?


## Neatline Public Exhibit /Public Omeka S Site:
- Added to public Omeka S sites with a page block to meet expectations of Omeka S users. (Browse Neatline Exhibits can also be page block, tbd) #83
- List of records should not be visible to public, only in editor, exhibit is just the map w/ possible Timeline and Text components #173
- Offer link to view exhibit in fullscreen #73
- Neatline CSS cannot affect Omeka Theme styling (should be resolved by moving Neatline editor into Omeka Admin, but then cannot affect Omeka Admin styling either) #174
