import { pipeline, env } from 'https://jsd.cdn.zzko.cn/npm/@xenova/transformers@2.6.0'
env.allowLocalModels=false;
// 新的线程
// 不能做DOM编程 
// this self 
// message 监听 
// postMessage 
// es6 简单  优雅 企业级大型项目开发 面向对象的class 
// extends static  get set 
class MyTranslationPipeline {
    static task = 'translation';
    static model = 'Xenova/nllb-200-distilled-600M';
    static instance = null;

    static async getInstance(progress_callback = null) {
        if (this.instance === null) {
            this.instance = pipeline(this.task, this.model, { 
                progress_callback });
        }

        return this.instance;
    }
}

// Listen for messages from the main thread
self.addEventListener('message', async (event) => {
    // Retrieve the translation pipeline. When called for the first time,
    // this will load the pipeline and save it for future use.
    let translator = await MyTranslationPipeline.getInstance(x => {
        // We also add a progress callback to the pipeline so that we can
        // track model loading.
        // console.log(x);
        self.postMessage(x);
    });

    // Actually perform the translation
    let output = await translator(event.data.text, {
        tgt_lang: event.data.tgt_lang,
        src_lang: event.data.src_lang,

        // Allows for partial output
        callback_function: x => {
            self.postMessage({
                status: 'update',
                output: translator.tokenizer.decode(x[0].output_token_ids, { skip_special_tokens: true })
            });
        }
    });

    // Send the output back to the main thread
    self.postMessage({
        status: 'complete',
        output: output,
    });
});
