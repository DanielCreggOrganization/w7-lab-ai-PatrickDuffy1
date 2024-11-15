import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, 
         IonGrid, IonRow, IonCol, IonCard, IonCardContent, 
         IonCardHeader, IonCardTitle, IonItem, IonLabel, 
         IonButton, IonIcon, IonProgressBar, IonText,
         IonRadioGroup, IonRadio, IonImg, IonTextarea,
         IonRippleEffect } from '@ionic/angular/standalone';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { environment } from '../../environments/environment';
import { GeminiAiService } from '../services/gemini-ai.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  standalone: true,
  imports: [
    // TODO: Add all the Ionic components from the imports above
    // HINT: Copy each component name from the imports list
    CommonModule, 
    FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, 
         IonGrid, IonRow, IonCol, IonCard, IonCardContent, 
         IonCardHeader, IonCardTitle, IonItem, IonLabel, 
         IonButton, IonIcon, IonProgressBar, IonText,
         IonRadioGroup, IonRadio, IonImg, IonTextarea,
         IonRippleEffect
  ]
})
export class HomePage {
  constructor(private geminiService: GeminiAiService) {}
  // TODO: Add default prompt
  // HINT: Something like "Provide a recipe for these baked goods"
  prompt = "Provide a recipe for these baked goods"; 
  output = '';
  isLoading = false;

  availableImages = [
    { url: 'assets/images/baked_goods_1.jpg', label: 'Baked Good 1' },
    { url: 'assets/images/baked_goods_2.jpg', label: 'Baked Good 2' },
    { url: 'assets/images/baked_goods_3.jpg', label: 'Baked Good 3' },
    { url: 'assets/images/baked_goods_4.jpg', label: 'Baked Good 4' },
    { url: 'assets/images/baked_goods_5.jpg', label: 'Baked Good 5' },
    { url: 'assets/images/baked_goods_6.jpg', label: 'Baked Good 6' }
  ];

  selectedImage = this.availableImages[0].url;

  get formattedOutput() {
    return this.output.replace(/\n/g, '<br>');
  }

  selectImage(url: string) {
    // TODO: Set the selectedImage property
    this.selectedImage = url;
  }

  async onSubmit() {
    if (this.isLoading) return;
    this.isLoading = true;
    
    try {
      const base64Image = await this.geminiService.getImageAsBase64(this.selectedImage);
      this.output = await this.geminiService.generateRecipe(base64Image, this.prompt);
      
    } catch (e) {
      this.output = `Error: ${e instanceof Error ? e.message : 'Something went wrong'}`;
    }
    
    this.isLoading = false;
  }
}