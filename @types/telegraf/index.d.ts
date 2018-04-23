import { Agent } from 'https';
import { ServerResponse } from 'http';
import { TlsOptions } from 'tls';

declare class Telegraf {

  static action(triggers: string[] | RegExp[] | Function[], handler: Telegraf.Middleware): Telegraf.Middleware;
  static branch(test: any | ((ctx: Telegraf.Context) => boolean), trueMiddleware: Telegraf.Middleware, falseMiddleware: Telegraf.Middleware): void;
  static compose(middlewares: Telegraf.Middleware[]): Telegraf.Middleware;
  static hears(triggers: string[] | RegExp[] | Function[], handler: Telegraf.Middleware): Telegraf.Middleware;
  static mount(updateTypes: (Telegraf.UpdateType | Telegraf.UpdateSubType) | (Telegraf.UpdateType | Telegraf.UpdateSubType)[], middleware: Telegraf.Middleware): Telegraf.Middleware;
  static optional(test: any | ((ctx: Telegraf.Context) => boolean), middleware: Telegraf.Middleware): void;
  static passThru(): Telegraf.Middleware;

  constructor(token: string, options?: Telegraf.TelegrafOptions);

  action(triggers: string[] | RegExp[], ...middleware: Telegraf.Middleware[]): void;
  command(triggers: string[], ...middleware: Telegraf.Middleware[]): void;
  gameQuery(...middleware: Telegraf.Middleware[]): void;
  handleUpdate(rawUpdate: any, webhookResponse?: ServerResponse): void;
  hears(triggers: string[] | RegExp[] | Function, ...middleware: Telegraf.Middleware[]): void;
  on(updateTypes: (Telegraf.UpdateType | Telegraf.UpdateSubType) | (Telegraf.UpdateType | Telegraf.UpdateSubType)[], ...middleware: Telegraf.Middleware[]): void;
  startPolling(timeout?: number, limit?: number, allowedUpdates?: string[]): void;
  startWebhook(webhookPath: string, tlsOptions: TlsOptions | null, port: number, host?: string): void;
  stop(): void;
  use(middleware: Telegraf.Middleware): void;
  webhookCallback(webhookPath: string): Function;
}

declare namespace Telegraf {

  type UpdateType = 'callback_query'
    | 'channel_post'
    | 'chosen_inline_result'
    | 'edited_channel_post'
    | 'edited_message'
    | 'inline_query'
    | 'message';

  type UpdateSubType = 'audio'
    | 'channel_chat_created'
    | 'contact'
    | 'delete_chat_photo'
    | 'document'
    | 'game'
    | 'group_chat_created'
    | 'left_chat_member'
    | 'location'
    | 'migrate_from_chat_id'
    | 'migrate_to_chat_id'
    | 'new_chat_member'
    | 'new_chat_photo'
    | 'new_chat_title'
    | 'photo'
    | 'pinned_message'
    | 'sticker'
    | 'supergroup_chat_created'
    | 'text'
    | 'venue'
    | 'video'
    | 'voice';

  type InlineQueryResultType = 'article'
    | 'audio'
    | 'audio'
    | 'contact'
    | 'document'
    | 'document'
    | 'game'
    | 'gif'
    | 'gif'
    | 'location'
    | 'mpeg4_gif'
    | 'mpeg4_gif'
    | 'photo'
    | 'photo'
    | 'sticker'
    | 'venue'
    | 'video'
    | 'video'
    | 'voice'
    | 'voice';

  type ChatMemberStatus = 'creator' | 'administrator' | 'member' | 'left' | 'kicked';

  type ChatAction = 'typing' | 'upload_photo' | 'upload_video' | 'upload_audio' | 'upload_document' | 'find_location';

  interface TelegrafOptions {
    telegram?: TelegramOptions;
    username?: string;
  }

  interface TelegramOptions {
    agent?: Agent;
    webhookReply?: boolean;
  }

  interface Context {
    telegram: Telegraf.Telegram;
    updateType: UpdateType;
    updateSubType?: UpdateSubType;
    me?: string;
    message?: Message;
    editedMessage?: Message;
    inlineQuery?: InlineQuery;
    chosenInlineResult?: InlineQueryResult;
    callbackQuery?: CallbackQuery;
    channelPost?: Message;
    editedChannelPost?: Message;
    chat?: Chat;
    from?: User;
    match?: RegExp;

    answerCallbackQuery(text?: string, url?: string, showAlert?: boolean, cacheTime?: number): Promise<true>;
    answerInlineQuery<T extends InlineQueryResult>(results: T[], extra?: AnswerInlineQueryExtra): Promise<true>;

    editMessageCaption(messageId: string, inlineMessageId: string, caption: string, extra?: EditMessageCaptionExtra): Promise<Message | true>;
    editMessageReplyMarkup(messageId: string, inlineMessageId: string, markup: any, extra?: EditMessageReplyMarkupExtra): Promise<Message | true>;
    editMessageText(messageId: string, inlineMessageId: string, text: string, extra?: EditMessageTextExtra): Promise<Message | true>;

    getChat(): Promise<Chat>;
    getChatAdministrators(): Promise<ChatMember[]>;
    getChatMember(userId: number): Promise<ChatMember>;
    getChatMembersCount(): Promise<number>;

    leaveChat(): Promise<true>;

    reply(text: string, extra?: SendMessageExtra): Promise<Message>;
    replyWithMarkdown(text: string, extra?: SendMessageExtra): Promise<Message>;
    replyWithHTML(text: string, extra?: SendMessageExtra): Promise<Message>;

    replyWithAudio(audio: File, extra?: SendAudioExtra): Promise<Message>;
    replyWithChatAction(action: ChatAction): Promise<true>;
    replyWithDocument(doc: File, extra?: SendDocumentExtra): Promise<Message>;
    replyWithGame(gameName: string, extra?: SendGameExtra): Promise<Message>;
    replyWithLocation(latitude: number, longitude: number, extra?: SendLocationExtra): Promise<Message>;
    replyWithPhoto(photo: File, extra?: SendPhotoExtra): Promise<Message>;
    replyWithSticker(sticker: File, extra?: SendStickerExtra): Promise<Message>;
    replyWithVideo(video: File, extra?: SendVideoExtra): Promise<Message>;
    replyWithVoice(voice: File, extra?: SendVoiceExtra): Promise<Message>;
  }

  interface Middleware {
    (ctx: Context): void;
  }

  interface CallbackQuery {
    id: string;
    from: User;
    chat_instance: string;
    message?: Message;
    inline_message_id?: string;
    data?: string;
    game_short_name?: string;
  }

  interface AnswerInlineQueryExtra {
    cache_time: number;
    is_personal: boolean;
    next_offset: string;
    switch_pm_text: string;
    switch_pm_parameter: string;
  }

  interface InlineQuery {
    id: string;
    from: User;
    query: string;
    offset: string;
    location?: Location;
  }

  interface InlineQueryResult {
    type: InlineQueryResultType;
  }

  interface InlineQueryResultArticle extends InlineQueryResult {
    type: 'article';
    id: string;
    title: string;
    input_message_content: InputMessageContent;
    reply_markup?: InlineKeyboardMarkup;
    url?: string;
    hide_url?: boolean;
    description?: string;
    thumb_url?: string;
    thumb_width?: number;
    thumb_height?: number;
  }

  interface InlineQueryResultPhoto extends InlineQueryResult {
    type: 'photo';
    id: string;
    photo_url: string;
    thumb_url: string;
    photo_width?: number;
    photo_height?: number;
    title?: string;
    description?: string;
    caption?: string;
    reply_markup?: InlineKeyboardMarkup;
    input_message_content?: InputMessageContent;
  }

  interface InlineQueryResultGif extends InlineQueryResult {
    type: 'gif';
    id: string;
    gif_url: string;
    gif_width?: number;
    gif_height?: number;
    thumb_url: string;
    title?: string;
    caption?: string;
    reply_markup?: InlineKeyboardMarkup;
    input_message_content?: InputMessageContent;
  }

  interface InlineQueryResultMpeg4Gif extends InlineQueryResult {
    type: 'mpeg4_gif';
    id: string;
    mpeg4_url: string;
    mpeg4_width?: number;
    mpeg4_height?: number;
    thumb_url: string;
    title?: string;
    caption?: string;
    reply_markup?: InlineKeyboardMarkup;
    input_message_content?: InputMessageContent;
  }

  interface InlineQueryResultVideo extends InlineQueryResult {
    type: 'video';
    id: string;
    video_url: string;
    mime_type: string;
    thumb_url: string;
    title: string;
    caption?: string;
    video_width?: number;
    video_height?: number;
    video_duration?: number;
    description?: string;
    reply_markup?: InlineKeyboardMarkup;
    input_message_content?: InputMessageContent;
  }

  interface InlineQueryResultAudio extends InlineQueryResult {
    type: 'audio';
    id: string;
    audio_url: string;
    title: string;
    caption?: string;
    performer?: string;
    audio_duration?: number;
    reply_markup?: InlineKeyboardMarkup;
    input_message_content?: InputMessageContent;
  }

  interface InlineQueryResultVoice extends InlineQueryResult {
    type: 'voice';
    id: string;
    voice_url: string;
    title: string;
    caption?: string;
    voice_duration?: number;
    reply_markup?: InlineKeyboardMarkup;
    input_message_content?: InputMessageContent;
  }

  interface InlineQueryResultDocument extends InlineQueryResult {
    type: 'document';
    id: string;
    title: string;
    caption?: string;
    document_url: string;
    mime_type: string;
    description?: string;
    reply_markup?: InlineKeyboardMarkup;
    input_message_content?: InputMessageContent;
    thumb_url?: string;
    thumb_width?: number;
    thumb_height?: number;
  }

  interface InlineQueryResultLocation extends InlineQueryResult {
    type: 'location';
    id: string;
    latitude: number;
    longitude: number;
    title: string;
    reply_markup?: InlineKeyboardMarkup;
    input_message_content?: InputMessageContent;
    thumb_url?: string;
    thumb_width?: number;
    thumb_height?: number;
  }

  interface InlineQueryResultVenue extends InlineQueryResult {
    type: 'venue';
    id: string;
    latitude: number;
    longitude: number;
    title: string;
    address: string;
    foursquare_id?: string;
    reply_markup?: InlineKeyboardMarkup;
    input_message_content?: InputMessageContent;
    thumb_url?: string;
    thumb_width?: number;
    thumb_height?: number;
  }

  interface InlineQueryResultContact extends InlineQueryResult {
    type: 'contact';
    id: string;
    phone_number: string;
    first_name: string;
    last_name?: string;
    reply_markup?: InlineKeyboardMarkup;
    input_message_content?: InputMessageContent;
    thumb_url?: string;
    thumb_width?: number;
    thumb_height?: number;
  }

  interface InlineQueryResultGame extends InlineQueryResult {
    type: 'game';
    id: string;
    game_short_name: string;
    reply_markup?: InlineKeyboardMarkup;
  }

  interface InlineQueryResultCachedPhoto extends InlineQueryResult {
    type: 'photo';
    id: string;
    photo_file_id: string;
    title?: string;
    description?: string;
    caption?: string;
    reply_markup?: InlineKeyboardMarkup;
    input_message_content?: InputMessageContent;
  }

  interface InlineQueryResultCachedGif extends InlineQueryResult {
    type: 'gif';
    id: string;
    gif_file_id: string;
    title?: string;
    caption?: string;
    reply_markup?: InlineKeyboardMarkup;
    input_message_content?: InputMessageContent;
  }

  interface InlineQueryResultCachedMpeg4Gif extends InlineQueryResult {
    type: 'mpeg4_gif';
    id: string;
    mpeg4_file_id: string;
    title?: string;
    caption?: string;
    reply_markup?: InlineKeyboardMarkup;
    input_message_content?: InputMessageContent;
  }

  interface InlineQueryResultCachedSticker extends InlineQueryResult {
    type: 'sticker';
    id: string;
    sticker_file_id: string;
    reply_markup?: InlineKeyboardMarkup;
    input_message_content?: InputMessageContent;
  }

  interface InlineQueryResultCachedDocument extends InlineQueryResult {
    type: 'document';
    id: string;
    title: string;
    document_file_id: string;
    description?: string;
    caption?: string;
    reply_markup?: InlineKeyboardMarkup;
    input_message_content?: InputMessageContent;
  }

  interface InlineQueryResultCachedVideo extends InlineQueryResult {
    type: 'video';
    id: string;
    video_file_id: string;
    title: string;
    description?: string;
    caption?: string;
    reply_markup?: InlineKeyboardMarkup;
    input_message_content?: InputMessageContent;
  }

  interface InlineQueryResultCachedVoice extends InlineQueryResult {
    type: 'voice';
    id: string;
    voice_file_id: string;
    title: string;
    caption?: string;
    reply_markup?: InlineKeyboardMarkup;
    input_message_content?: InputMessageContent;
  }

  interface InlineQueryResultCachedAudio extends InlineQueryResult {
    type: 'audio';
    id: string;
    audio_file_id: string;
    caption?: string;
    reply_markup?: InlineKeyboardMarkup;
    input_message_content?: InputMessageContent;
  }

  interface InputMessageContent {
  }

  interface InputTextMessageContent extends InputMessageContent {
    message_text: string;
    parse_mode?: string;
    disable_web_page_preview?: boolean;
  }

  interface InputLocationMessageContent extends InputMessageContent {
    latitude: number;
    longitude: number;
  }

  interface InputVenueMessageContent extends InputMessageContent {
    latitude: number;
    longitude: number;
    title: string;
    address: string;
    foursquare_id?: string;
  }

  interface InputContactMessageContent extends InputMessageContent {
    phone_number: string;
    first_name: string;
    last_name?: string;
  }

  interface InlineKeyboardMarkup {
    inline_keyboard: InlineKeyboardButton[][];
  }

  interface InlineKeyboardButton {
    text: string;
    url?: string;
    callback_data?: string;
    switch_inline_query?: string;
    switch_inline_query_current_chat?: string;
    callback_game?: CallbackGame;
  }

  interface ReplyKeyboardMarkup {
    keyboard: KeyboardButton[];
    resize_keyboard?: boolean;
    one_time_keyboard?: boolean;
    selective?: boolean;
  }

  interface KeyboardButton {
    text: string;
    request_contact?: boolean;
    request_location?: boolean;
  }

  interface ReplyKeyboardRemove {
    remove_keyboard: true;
    selective?: boolean;
  }

  interface ForceReply {
    force_reply: true;
    selective?: boolean;
  }

  interface CallbackGame {
    user_id: number;
    score: number;
    force?: boolean;
    disable_edit_message?: boolean;
    chat_id?: number;
    message_id?: number;
    inline_message_id?: string;
  }

  interface EditMessageCaptionExtra {
    reply_markup?: InlineKeyboardMarkup;
  }

  interface EditMessageReplyMarkupExtra {
    reply_markup?: InlineKeyboardMarkup;
  }

  interface EditMessageTextExtra {
    parse_mode?: string;
    disable_web_page_preview?: boolean;
    reply_markup?: InlineKeyboardMarkup;
  }

  interface ForwardMessageExtra {
    disable_notification?: boolean;
  }

  interface SendMessageExtra {
    message_text: string;
    parse_mode?: string;
    disable_web_page_preview?: boolean;
    disable_notification?: boolean;
    reply_to_message_id?: number;
    reply_markup?: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply;
  }

  interface Message {
    message_id: number;
    date: number;
    chat: Chat;
    from?: User;
    forward_from?: User;
    forward_from_chat?: Chat;
    forward_from_message_id?: number;
    forward_date?: number;
    reply_to_message?: Message;
    edit_date?: number;
    text?: string;
    entities?: MessageEntity[];
    audio?: Audio;
    document?: Document;
    game?: Game;
    photo?: PhotoSize[];
    sticker?: Sticker;
    video?: Video;
    voice?: Voice;
    caption?: string;
    contact?: Contact;
    location?: Location;
    venue?: Venue;
    new_chat_member?: User;
    left_chat_member?: User;
    new_chat_title?: string;
    new_chat_photo?: PhotoSize[];
    delete_chat_photo?: true;
    group_chat_created?: true;
    supergroup_chat_created?: true;
    channel_chat_created?: true;
    migrate_to_chat_id?: number;
    migrate_from_chat_id?: number;
    pinned_message?: Message;
  }

  interface User {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
  }

  interface Chat {
    id: number;
    type: string;
    title?: string;
    username?: string;
    first_name?: string;
    last_name?: string;
    all_members_are_administrators?: boolean;
  }

  interface MessageEntity {
    type: string;
    offset: number;
    length: number;
    url?: string;
    user?: User;
  }

  interface Audio {
    file_id: string;
    duration: number;
    performer?: string;
    title?: string;
    mime_type?: string;
    file_size?: number;
  }

  interface Document {
    file_id: string;
    thumb?: PhotoSize;
    file_name?: string;
    mime_type?: string;
    file_size?: number;
  }

  interface Sticker {
    file_id: string;
    width: number;
    height: number;
    thumb?: PhotoSize;
    emoji?: string;
    file_size?: number;
  }

  interface PhotoSize {
    file_id: string;
    width: number;
    height: number;
    file_size?: number;
  }

  interface Video {
    file_id: string;
    width: number;
    height: number;
    duration: number;
    thumb?: PhotoSize;
    mime_type?: string;
    file_size?: number;
  }

  interface Voice {
    file_id: string;
    duration: number;
    mime_type?: string;
    file_size?: number;
  }

  interface Contact {
    phone_number: string;
    first_name: string;
    last_name?: string;
    user_id?: number;
  }

  interface Location {
    longitude?: number;
    latitude?: number;
  }

  interface Venue {
    location: Location;
    title: string;
    address: string;
    foursquare_id?: string;
  }

  interface Game {
    title: string;
    description: string;
    photo: PhotoSize[];
    text?: string;
    text_entities?: MessageEntity[];
    animation?: Animation;
  }

  interface Animation {
    file_id: string;
    thumb?: PhotoSize;
    file_name?: string;
    mime_type?: string;
    file_size?: number;
  }

  interface WebhookInfo {
    url: string;
    has_custom_certificate: boolean;
    pending_update_count: number;
    last_error_date?: number;
    last_error_message?: string;
    max_connections?: number;
    allowed_updates?: string[];
  }

  interface ChatMember {
    user: User;
    status: ChatMemberStatus;
  }

  interface GameHighScore {
    position: number;
    user: User;
    score: number;
  }

  interface UserProfilePhotos {
    total_count: number;
    photos: PhotoSize[][];
  }

  interface SendAudioExtra {
    chat_id: number | string;
    audio: any | string;
    caption?: string;
    duration?: number;
    performer?: string;
    title?: string;
    disable_notification?: boolean;
    reply_to_message_id?: number;
    reply_markup?: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply;
  }

  interface SendGameExtra {
    chat_id: number;
    game_short_name: string;
    disable_notification?: boolean;
    reply_to_message_id?: number;
    reply_markup?: InlineKeyboardMarkup;
  }

  interface SendContactExtra {
    last_name?: string;
    disable_notification?: boolean;
    reply_to_message_id?: number;
    reply_markup?: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply;
  }

  interface SendDocumentExtra {
    caption?: string;
    disable_notification?: boolean;
    reply_to_message_id?: number;
    reply_markup?: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply;
  }

  interface SendLocationExtra {
    disable_notification?: boolean;
    reply_to_message_id?: number;
    reply_markup?: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply;
  }

  interface SendPhotoExtra {
    caption?: string;
    disable_notification?: boolean;
    reply_to_message_id?: number;
    reply_markup?: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply;
  }

  interface SendStickerExtra {
    disable_notification?: boolean;
    reply_to_message_id?: number;
    reply_markup?: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply;
  }

  interface SendVenueExtra {
    foursquare_id?: string;
    disable_notification?: boolean;
    reply_to_message_id?: number;
    reply_markup?: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply;
  }

  interface SendVideoExtra {
    duration?: number;
    width?: number;
    height?: number;
    caption?: string;
    disable_notification?: boolean;
    reply_to_message_id?: number;
    reply_markup?: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply;
  }

  interface SendVoiceExtra {
    caption?: string;
    duration?: number;
    disable_notification?: boolean;
    reply_to_message_id?: number;
    reply_markup?: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply;
  }

  class Telegram {

    webhookReply: boolean;

    constructor(token: string, options?: TelegrafOptions);

    answerCallbackQuery(callbackQueryId: string, text?: string, url?: string, showAlert?: boolean, cacheTime?: number): Promise<true>;
    answerInlineQuery<T extends InlineQueryResult>(inlineQueryId: string, results: T[], extra?: AnswerInlineQueryExtra): Promise<true>;

    forwardMessage(chatId: number | string, fromChatId: number | string, messageId: number, extra?: ForwardMessageExtra): Promise<Message>;

    editMessageCaption(chatId: number | string, messageId: string, inlineMessageId: string, caption: string, extra?: EditMessageCaptionExtra): Promise<Message | true>;
    editMessageReplyMarkup(chatId: number | string, messageId: string, inlineMessageId: string, markup: any, extra?: EditMessageReplyMarkupExtra): Promise<Message | true>;
    editMessageText(chatId: number | string, messageId: string, inlineMessageId: string, text: string, extra?: EditMessageTextExtra): Promise<Message | true>;

    getChat(chatId: number | string): Promise<Chat>;
    getChatAdministrators(chatId: number | string): Promise<ChatMember[]>;
    getChatMember(chatId: number | string, userId: number): Promise<ChatMember>;
    getChatMembersCount(chatId: number | string): Promise<number>;
    getFile(fileId: string): Promise<File>;
    getFileLink(fileId: string): Promise<string>;
    getGameHighScores(userId: number, inlineMessageId?: string, chatId?: number | string, messageId?: number | string): Promise<GameHighScore[]>;
    getMe(): Promise<User>;
    getUserProfilePhotos(userId: number, offset?: number, limit?: number): Promise<UserProfilePhotos>;
    setGameScore(userId: number, score: number, inlineMessageId?: string, chatId?: number | string, messageId?: number | string, editMessage?: boolean, force?: boolean): Promise<Message | true>;

    kickChatMember(chatId: number | string, userId: number): Promise<true>;
    unbanChatMember(chatId: number | string, userId: number): Promise<true>;

    leaveChat(chatId: number | string): Promise<true>;

    deleteWebhook(): Promise<true>;
    getWebhookInfo(): Promise<WebhookInfo>;
    setWebhook(url: string, cert?: File, maxConnections?: number, allowedUpdates?: string[]): Promise<true>;

    sendAudio(chatId: number | string, audio: File, extra?: SendAudioExtra): Promise<Message>;
    sendChatAction(chatId: number | string, action: ChatAction): Promise<true>;
    sendContact(chatId: number | string, phoneNumber: string, firstName: string, extra?: SendContactExtra): Promise<Message>;
    sendCopy(chatId: number | string, message: Message, extra?: SendMessageExtra): Promise<Message>;
    sendDocument(chatId: number | string, doc: File, extra?: SendDocumentExtra): Promise<Message>;
    sendGame(chatId: number | string, gameName: string, extra?: SendGameExtra): Promise<Message>;
    sendLocation(chatId: number | string, latitude: number, longitude: number, extra?: SendLocationExtra): Promise<Message>;
    sendMessage(chatId: number | string, text: string, extra?: SendMessageExtra): Promise<Message>;
    sendPhoto(chatId: number | string, photo: File, extra?: SendPhotoExtra): Promise<Message>;
    sendSticker(chatId: number | string, sticker: File, extra?: SendStickerExtra): Promise<Message>;
    sendVenue(chatId: number | string, latitude: number, longitude: number, title: string, address: string, extra?: SendVenueExtra): Promise<Message>;
    sendVideo(chatId: number | string, video: File, extra?: SendVideoExtra): Promise<Message>;
    sendVoice(chatId: number | string, voice: File, extra?: SendVoiceExtra): Promise<Message>;
  }
}

export = Telegraf;
