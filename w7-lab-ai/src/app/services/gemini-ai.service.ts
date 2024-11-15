import { Injectable } from '@angular/core';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GeminiAiService {
  //private readonly MODEL_NAME = 'gemini-1.5-flash';
  public output: string = '';
  private prompt: string = ''; // Set this via a method or in the constructor

  async getImageAsBase64(imageUrl: string): Promise<string> {
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch image');
      }
      const blob = await response.blob();
      const base64data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(blob);
      });
      const base64String = base64data.split(',')[1];
      return base64String;
    } catch (error) {
      console.error('Error fetching image or converting to base64:', error);
      throw error;
    }
  }

  async generateRecipe(imageBase64: string, prompt: string, selectedModel:string): Promise<string> {

    console.log("model: " + selectedModel)

    try {
      const genAI = new GoogleGenerativeAI(environment.apiKey);
      const model = genAI.getGenerativeModel({ model: selectedModel });

      const result = await model.generateContent({
        contents: [{
          role: 'user',
          parts: [
            { 
              inlineData: { 
                mimeType: 'image/jpeg', 
                data: imageBase64
              } 
            },
            { text: prompt }
          ]
        }]
      });

      this.output = result.response.text();
    } catch (error) {
      this.output = `Error: ${error instanceof Error ? error.message : 'Something went wrong'}`;
      throw new Error('Failed to generate recipe' + error);
    }

    return this.output;
  }
}
