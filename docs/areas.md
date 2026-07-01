# Home Assistant Areas — Devices & Entities

_Generated: 2026-07-01 13:44:41 UTC_

Auto-generated reference of every area's devices and entities, grouped by
domain. Source of truth is the device/entity/area registries on the device
(`.storage/`) — this file is a point-in-time snapshot, not synced automatically.
Disabled-by-default entities are omitted for readability. A final
"Unassigned" section lists devices/entities with no area — mostly
system/integration infra, but worth a periodic skim for real gaps.

Regenerate via `bin/update-areas-doc.py`.

**6 areas, 49 devices, 207 entities** (+ 0 unassigned devices, 0 unassigned entities).

| Area | ID | Devices | Entities |
|---|---|---|---|
| Abi | `abi` | 4 | 5 |
| Kitchen | `kitchen` | 4 | 18 |
| LR | `lr` | 7 | 22 |
| MB | `mb` | 7 | 35 |
| Trmns | `trmns` | 26 | 126 |
| Yard | `yard` | 1 | 1 |
| _Unassigned_ | — | 0 | 0 |

## Abi (`abi`)

### Devices (4)

| Name | Device ID |
|---|---|
| Abi: Led Two | `175e78412977a42bd100b13bb467d865` |
| Desk Lamp | `c9241b2a79b5872396edc88d8a8160e0` |
| Led One | `696e93b3e09db667c53874bfc324cc4a` |
| Pixoo | `6f1ee1b08d4c7d905fc2ef2c69bb5cac` |

### Entities (5)

#### Lights (3)

| Entity ID | Name |
|---|---|
| `light.abi_led_one` | Led One |
| `light.abi_led_two` | Abi: Led Two |
| `light.abi_pixoo_light` | Pixoo Light |

#### Switches (1)

| Entity ID | Name |
|---|---|
| `switch.abi_desk_lamp_socket` | Socket |

#### Sensors (1)

| Entity ID | Name |
|---|---|
| `sensor.abi_pixoo_current_page` | Current Page |

## Kitchen (`kitchen`)

### Devices (4)

| Name | Device ID |
|---|---|
| Counter | `c81d6569fd05307fd6843bad50c1e1d2` |
| Led One | `90f371f2015c3e8e8e1f73977d42827c` |
| Led Two | `2a0dfd3e1e10fa72be1d711b824a5815` |
| Lobby | `b7a6b645ccd74f1fd7e07e5f2aae8b81` |

### Entities (18)

#### Lights (4)

| Entity ID | Name |
|---|---|
| `light.kitchen_counter` | Counter |
| `light.kitchen_led_one` | Led One |
| `light.kitchen_led_two` | Led Two |
| `light.kitchen_lobby` | Lobby |

#### Buttons (2)

| Entity ID | Name |
|---|---|
| `button.kitchen_counter_identify` | Counter Identify |
| `button.kitchen_lobby_identify` | Lobby Identify |

#### Numbers (10)

| Entity ID | Name |
|---|---|
| `number.kitchen_counter_off_transition_time` | Counter Off transition time |
| `number.kitchen_counter_on_level` | Counter On level |
| `number.kitchen_counter_on_off_transition_time` | Counter On/Off transition time |
| `number.kitchen_counter_on_transition_time` | Counter On transition time |
| `number.kitchen_counter_power_on_level` | Counter Power-on level |
| `number.kitchen_lobby_off_transition_time` | Lobby Off transition time |
| `number.kitchen_lobby_on_level` | Lobby On level |
| `number.kitchen_lobby_on_off_transition_time` | Lobby On/Off transition time |
| `number.kitchen_lobby_on_transition_time` | Lobby On transition time |
| `number.kitchen_lobby_power_on_level` | Lobby Power-on level |

#### Selects (2)

| Entity ID | Name |
|---|---|
| `select.kitchen_counter_power_on_behavior` | Counter Power-on behavior |
| `select.kitchen_lobby_power_on_behavior` | Lobby Power-on behavior |

## LR (`lr`)

### Devices (7)

| Name | Device ID |
|---|---|
| Dining | `e17cf3f460205b07d4b533b30fea5a1d` |
| Lamp | `50d43a0cd484d49414204f4ebbf51b85` |
| Light Sensor | `0ce6beae5a99fe11f79ebc4d4cca973e` |
| Living | `183d57d42c40ec874525987b0a79b6f5` |
| PlayStation 5 | `9ee9b3f0bc469a1137013186a36fb77d` |
| TV | `27133817da8e53760a3900ea945e9492` |
| TV Hub | `08da9d9d9d378760474044c8efdd2ef0` |

### Entities (22)

#### Automations (2)

| Entity ID | Name |
|---|---|
| `automation.lr_auto_daylight` | LR: Auto Scene |
| `automation.lr_playing_tv` | LR: TV Scene |

#### Scenes (4)

| Entity ID | Name |
|---|---|
| `scene.lr_bluish` | LR: Bluish |
| `scene.lr_day_light` | LR: Day Light |
| `scene.lr_dim` | LR: Dim |
| `scene.lr_redish` | LR: Redish |

#### Lights (2)

| Entity ID | Name |
|---|---|
| `light.lr_dining` | Dining |
| `light.lr_living` | Living |

#### Switches (2)

| Entity ID | Name |
|---|---|
| `switch.lr_lamp_socket` | Socket |
| `switch.lr_light_sensor` | Light Sensor |

#### Media Players (3)

| Entity ID | Name |
|---|---|
| `media_player.lr_playstation_5` | media_player.lr_playstation_5 |
| `media_player.lr_tv` | TV |
| `media_player.lr_tv_hub_cast` | TV Hub: Cast |

#### Sensors (9)

| Entity ID | Name |
|---|---|
| `sensor.lr_light_sensor_brightness_intensity` | Light Sensor Brightness intensity |
| `sensor.lr_light_sensor_illuminance` | Light Sensor Illuminance |
| `sensor.lr_tv_energy` | TV Energy |
| `sensor.lr_tv_energy_difference` | TV Energy difference |
| `sensor.lr_tv_energy_saved` | TV Energy saved |
| `sensor.lr_tv_power` | TV Power |
| `sensor.lr_tv_power_energy` | TV Power energy |
| `sensor.lr_tv_tv_channel` | TV TV channel |
| `sensor.lr_tv_tv_channel_name` | TV TV channel name |

## MB (`mb`)

### Devices (7)

| Name | Device ID |
|---|---|
| Lamp | `0997ecdf6454a32c69765340adf54399` |
| Led One | `444470b2d5bd0a3d203b144abf463b47` |
| Led Two | `d1bc6730516f9413a9cda08651ff59f8` |
| Light Sensor | `66437514c9a524d2f0d7f5e87b40846b` |
| PlayStation 4 | `a33a50cd7db12500e4532448b6c3fd63` |
| TV | `bbd7bcd9d836f0319ca1bbc64688a298` |
| TV Hub | `9cf1f556324127bed50f5837534d4c2f` |

### Entities (35)

#### Automations (2)

| Entity ID | Name |
|---|---|
| `automation.auto_daylight` | MB: Auto Daylight |
| `automation.mb_tv_playing` | MB: Playing TV |

#### Scenes (4)

| Entity ID | Name |
|---|---|
| `scene.mb_bluish` | MB: Bluish |
| `scene.mb_day_light` | MB: Day Light |
| `scene.mb_dim` | MB: Dim |
| `scene.mb_redish` | MB: Redish |

#### Lights (2)

| Entity ID | Name |
|---|---|
| `light.mb_led_one` | Led One |
| `light.mb_led_two` | Led Two |

#### Switches (2)

| Entity ID | Name |
|---|---|
| `switch.mb_lamp_socket` | Socket |
| `switch.mb_light_sensor` | Light Sensor |

#### Media Players (2)

| Entity ID | Name |
|---|---|
| `media_player.mb_playstation_4` | media_player.mb_playstation_4 |
| `media_player.mb_tv` | TV |

#### Sensors (9)

| Entity ID | Name |
|---|---|
| `sensor.mb_light_sensor_brightness_intensity` | Light Sensor Brightness intensity |
| `sensor.mb_light_sensor_illuminance` | Light Sensor Illuminance |
| `sensor.mb_tv_energy` | TV Energy |
| `sensor.mb_tv_energy_difference` | TV Energy difference |
| `sensor.mb_tv_energy_saved` | TV Energy saved |
| `sensor.mb_tv_power` | TV Power |
| `sensor.mb_tv_power_energy` | TV Power energy |
| `sensor.mb_tv_tv_channel` | TV TV channel |
| `sensor.mb_tv_tv_channel_name` | TV TV channel name |

#### Buttons (2)

| Entity ID | Name |
|---|---|
| `button.mb_led_one_identify` | Led One Identify |
| `button.mb_led_two_identify` | Led Two Identify |

#### Numbers (10)

| Entity ID | Name |
|---|---|
| `number.mb_led_one_off_transition_time` | Led One Off transition time |
| `number.mb_led_one_on_level` | Led One On level |
| `number.mb_led_one_on_off_transition_time` | Led One On/Off transition time |
| `number.mb_led_one_on_transition_time` | Led One On transition time |
| `number.mb_led_one_power_on_level` | Led One Power-on level |
| `number.mb_led_two_off_transition_time` | Led Two Off transition time |
| `number.mb_led_two_on_level` | Led Two On level |
| `number.mb_led_two_on_off_transition_time` | Led Two On/Off transition time |
| `number.mb_led_two_on_transition_time` | Led Two On transition time |
| `number.mb_led_two_power_on_level` | Led Two Power-on level |

#### Selects (2)

| Entity ID | Name |
|---|---|
| `select.mb_led_one_power_on_behavior` | Led One Power-on behavior |
| `select.mb_led_two_power_on_behavior` | Led Two Power-on behavior |

## Trmns (`trmns`)

### Devices (26)

| Name | Device ID |
|---|---|
| Advanced SSH & Web Terminal | `d1be420be4a83917ae5616e757f26700` |
| Backup | `f7477133b8de4868f75d03a37f336b1f` |
| Divoom Pixoo 64 | `82e054c5e622d8e667e2a997f9a8cac5` |
| Forecast | `7246322dbcf11aa5dbdedabc57fa984e` |
| Google Translate en com | `140ea4ff2b0fdf242221961d0f19d3d3` |
| HA Divoom Pixoo Skills | `b085be6c939f5bdd5688d55fbde8f199` |
| HACS | `5e3053807cbf3c42060cb5ecf446f5f0` |
| Home Assistant Core | `4f547add5a4c28335def040c3c63cdb5` |
| Home Assistant Host | `ed54dc238907b6ca7b9a6eb03976f836` |
| Home Assistant Operating System | `71479d02f0c57d5222ab57a017829aea` |
| Home Assistant Supervisor | `65da37e577e72b49829940a02797d887` |
| Matter Server | `200825264d271bd9701f74881bb74c42` |
| Nanis’ iPhone | `e37d126063a41c7be8e600753acf84a4` |
| Norman’s iPad | `bf50cc7a3045e40ea9b2d7855dfc8047` |
| Norman’s iPhone ++ | `cbba88b6757bbe56db85af12df6e08dc` |
| Notifications | `68cdee566db8d4a7ba80347164969ca2` |
| Studio Code Server | `3ace2aab93535cbaa8ddea0f04975dcf` |
| Sun | `be4da2b9a32ab8d66bcaef2860a5ca58` |
| System Monitor | `9815dd0d5466095b85f90ae1cef457b1` |
| Tailscale | `9898e4046332eb69f90ce89bdf66ec0c` |
| Terminus | `d1236a2c402601b22cec8b28d0959264` |
| Terminus RAG | `0c885c91484163693a403ec4502e547a` |
| Turn Off | `b9bf6c14ad36ccf37778503fc66e3b16` |
| Turn On | `8701cb6268264d0d7cb8dcacd323d1c5` |
| iPhone | `02c50317096ed50ebe364c2e8bc3b1d2` |
| nerami_h | `e89e78db09e6ecc2c7784a5d09ea8c0b` |

### Entities (126)

#### Automations (12)

| Entity ID | Name |
|---|---|
| `automation.night_walk` | Night Walk: On |
| `automation.night_walk_off` | Night Walk: Off |
| `automation.notify_calendar_event_created` | Notify: calendar event created |
| `automation.notify_calendar_event_deleted` | Notify: calendar event deleted |
| `automation.notify_calendar_event_updated` | Notify: calendar event updated |
| `automation.notify_calendar_reminder_fires` | Notify: calendar reminder fires |
| `automation.sockets_illuminance_control` | Sockets: Illuminance Control |
| `automation.telegram_remind_empty_input_usage` | Telegram: /remind empty input → usage |
| `automation.telegram_remind_natural_language_claude` | Telegram: /remind natural language → Claude |
| `automation.turn_off_lights_when_leave` | Turn off lights when I leave home |
| `automation.turn_off_the_lights_at_10pm` | Turn off the lights at 10pm |
| `automation.turn_on_the_lights_when_i_get_home` | Turn on the lights when I get home late |

#### Scenes (2)

| Entity ID | Name |
|---|---|
| `scene.sockets_off` | Sockets: Off |
| `scene.sockets_on` | Sockets: On |

#### Switches (1)

| Entity ID | Name |
|---|---|
| `switch.sockets` | Sockets |

#### Sensors (72)

| Entity ID | Name |
|---|---|
| `sensor.backup_backup_manager_state` | Backup Backup Manager state |
| `sensor.backup_last_attempted_automatic_backup` | Backup Last attempted automatic backup |
| `sensor.backup_last_successful_automatic_backup` | Backup Last successful automatic backup |
| `sensor.backup_next_scheduled_automatic_backup` | Backup Next scheduled automatic backup |
| `sensor.nanis_iphone_activity` | Nanis’ iPhone Activity |
| `sensor.nanis_iphone_app_version` | Nanis’ iPhone App Version |
| `sensor.nanis_iphone_audio_output` | Nanis’ iPhone Audio Output |
| `sensor.nanis_iphone_average_active_pace` | Nanis’ iPhone Average Active Pace |
| `sensor.nanis_iphone_battery_level` | Nanis’ iPhone Battery Level |
| `sensor.nanis_iphone_battery_state` | Nanis’ iPhone Battery State |
| `sensor.nanis_iphone_bssid` | Nanis’ iPhone BSSID |
| `sensor.nanis_iphone_connection_type` | Nanis’ iPhone Connection Type |
| `sensor.nanis_iphone_distance` | Nanis’ iPhone Distance |
| `sensor.nanis_iphone_floors_ascended` | Nanis’ iPhone Floors Ascended |
| `sensor.nanis_iphone_floors_descended` | Nanis’ iPhone Floors Descended |
| `sensor.nanis_iphone_geocoded_location` | Nanis’ iPhone Geocoded Location |
| `sensor.nanis_iphone_last_update_trigger` | Nanis’ iPhone Last Update Trigger |
| `sensor.nanis_iphone_location_permission` | Nanis’ iPhone Location permission |
| `sensor.nanis_iphone_pressure` | Nanis’ iPhone Pressure |
| `sensor.nanis_iphone_sim_1` | Nanis’ iPhone SIM 1 |
| `sensor.nanis_iphone_sim_2` | Nanis’ iPhone SIM 2 |
| `sensor.nanis_iphone_ssid` | Nanis’ iPhone SSID |
| `sensor.nanis_iphone_steps` | Nanis’ iPhone Steps |
| `sensor.nanis_iphone_storage` | Nanis’ iPhone Storage |
| `sensor.normans_ipad_app_version` | Norman’s iPad App Version |
| `sensor.normans_ipad_audio_output` | Norman’s iPad Audio Output |
| `sensor.normans_ipad_battery_level` | Norman’s iPad Battery Level |
| `sensor.normans_ipad_battery_state` | Norman’s iPad Battery State |
| `sensor.normans_ipad_bssid` | Norman’s iPad BSSID |
| `sensor.normans_ipad_connection_type` | Norman’s iPad Connection Type |
| `sensor.normans_ipad_geocoded_location` | Norman’s iPad Geocoded Location |
| `sensor.normans_ipad_last_update_trigger` | Norman’s iPad Last Update Trigger |
| `sensor.normans_ipad_location_permission` | Norman’s iPad Location permission |
| `sensor.normans_ipad_ssid` | Norman’s iPad SSID |
| `sensor.normans_ipad_storage` | Norman’s iPad Storage |
| `sensor.normans_iphone_activity` | Norman’s iPhone ++ Activity |
| `sensor.normans_iphone_app_version` | Norman’s iPhone ++ App Version |
| `sensor.normans_iphone_audio_output` | Norman’s iPhone ++ Audio Output |
| `sensor.normans_iphone_average_active_pace` | Norman’s iPhone ++ Average Active Pace |
| `sensor.normans_iphone_battery_level` | Norman’s iPhone ++ Battery Level |
| `sensor.normans_iphone_battery_state` | Norman’s iPhone ++ Battery State |
| `sensor.normans_iphone_bssid` | Norman’s iPhone ++ BSSID |
| `sensor.normans_iphone_connection_type` | Norman’s iPhone ++ Connection Type |
| `sensor.normans_iphone_distance` | Norman’s iPhone ++ Distance |
| `sensor.normans_iphone_floors_ascended` | Norman’s iPhone ++ Floors Ascended |
| `sensor.normans_iphone_floors_descended` | Norman’s iPhone ++ Floors Descended |
| `sensor.normans_iphone_geocoded_location` | Norman’s iPhone ++ Geocoded Location |
| `sensor.normans_iphone_last_update_trigger` | Norman’s iPhone ++ Last Update Trigger |
| `sensor.normans_iphone_location_permission` | Norman’s iPhone ++ Location permission |
| `sensor.normans_iphone_pressure` | Norman’s iPhone ++ Pressure |
| `sensor.normans_iphone_sim_1` | Norman’s iPhone ++ SIM 1 |
| `sensor.normans_iphone_sim_2` | Norman’s iPhone ++ SIM 2 |
| `sensor.normans_iphone_ssid` | Norman’s iPhone ++ SSID |
| `sensor.normans_iphone_steps` | Norman’s iPhone ++ Steps |
| `sensor.normans_iphone_storage` | Norman’s iPhone ++ Storage |
| `sensor.sun_next_dawn` | Sun Next dawn |
| `sensor.sun_next_dusk` | Sun Next dusk |
| `sensor.sun_next_midnight` | Sun Next midnight |
| `sensor.sun_next_noon` | Sun Next noon |
| `sensor.sun_next_rising` | Sun Next rising |
| `sensor.sun_next_setting` | Sun Next setting |
| `sensor.system_monitor_cpu_pressure_some_10s_average` | System Monitor CPU pressure some 10s average |
| `sensor.trmns_nerami_h_bronze_trophies` | Bronze trophies |
| `sensor.trmns_nerami_h_gold_trophies` | Gold trophies |
| `sensor.trmns_nerami_h_last_online` | Last online |
| `sensor.trmns_nerami_h_next_level` | Next level |
| `sensor.trmns_nerami_h_now_playing` | Now playing |
| `sensor.trmns_nerami_h_online_id` | Online ID |
| `sensor.trmns_nerami_h_online_status` | Online status |
| `sensor.trmns_nerami_h_platinum_trophies` | Platinum trophies |
| `sensor.trmns_nerami_h_silver_trophies` | Silver trophies |
| `sensor.trmns_nerami_h_trophy_level` | Trophy level |

#### Binary Sensors (7)

| Entity ID | Name |
|---|---|
| `binary_sensor.iphone_presence` | iPhone Presence |
| `binary_sensor.is_bright` | Is Bright |
| `binary_sensor.is_dark` | Is Dark |
| `binary_sensor.nanis_iphone_focus` | Nanis’ iPhone Focus |
| `binary_sensor.normans_iphone_focus` | Norman’s iPhone ++ Focus |
| `binary_sensor.remote_ui` | Remote UI |
| `binary_sensor.trmns_nerami_h_subscribed_to_playstation_plus` | Subscribed to PlayStation Plus |

#### Device Trackers (3)

| Entity ID | Name |
|---|---|
| `device_tracker.nanis_iphone` | Nanis’ iPhone |
| `device_tracker.normans_ipad` | Norman’s iPad |
| `device_tracker.normans_iphone` | Norman’s iPhone ++ |

#### Calendars (1)

| Entity ID | Name |
|---|---|
| `calendar.reminders` | Reminders |

#### Weather (1)

| Entity ID | Name |
|---|---|
| `weather.forecast_home` | Forecast Home |

#### Notify (4)

| Entity ID | Name |
|---|---|
| `notify.nanis_iphone` | Nanis’ iPhone |
| `notify.normans_ipad` | Norman’s iPad |
| `notify.normans_iphone` | Norman’s iPhone ++ |
| `notify.notifications_norman_r` | Notifications Norman R. |

#### Events (2)

| Entity ID | Name |
|---|---|
| `event.backup_automatic_backup` | Backup Automatic backup |
| `event.notifications_update_event` | Notifications Update event |

#### Images (3)

| Entity ID | Name |
|---|---|
| `image.trmns_nerami_h_avatar` | Avatar |
| `image.trmns_nerami_h_now_playing` | Now playing |
| `image.trmns_nerami_h_share_profile` | Share profile |

#### Other (18)

| Entity ID | Name |
|---|---|
| `person.abril_ramirez` | Abril Ramírez |
| `person.norman_ramirez` | Norman Ramirez |
| `stt.home_assistant_cloud` | Home Assistant Cloud |
| `todo.shopping_list` | Shopping List |
| `tts.google_translate_en_com` | Google Translate en com |
| `tts.home_assistant_cloud` | Home Assistant Cloud |
| `update.advanced_ssh_web_terminal_update` | Advanced SSH & Web Terminal Update |
| `update.divoom_pixoo_64_update` | Divoom Pixoo 64 Update |
| `update.ha_divoom_pixoo_skills_update` | HA Divoom Pixoo Skills Update |
| `update.hacs_update` | HACS Update |
| `update.home_assistant_core_update` | Home Assistant Core Update |
| `update.home_assistant_operating_system_update` | Home Assistant Operating System Update |
| `update.home_assistant_supervisor_update` | Home Assistant Supervisor Update |
| `update.matter_server_update` | Matter Server Update |
| `update.studio_code_server_update` | Studio Code Server Update |
| `update.tailscale_update` | Tailscale Update |
| `update.terminus_langchain_update` | Terminus Update |
| `update.terminus_rag_update` | Terminus RAG Update |

## Yard (`yard`)

### Devices (1)

| Name | Device ID |
|---|---|
| String Lights | `d503d1386f7a1c558e7fe79687b35824` |

### Entities (1)

#### Switches (1)

| Entity ID | Name |
|---|---|
| `switch.yard_string_lights_socket` | Socket |

## Unassigned (no area)

### Devices (0)

_No devices._

### Entities (0)

