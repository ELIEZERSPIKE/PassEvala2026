import api from './api';
import { Article, Short, Sponsor, FlashInfo, BonPlan, UsefulNumber } from '../types';

export const articleService = {
  getArticles: async (): Promise<Article[]> => {
    const response = await api.get('/articles');
    return response.data.data;
  }
};

export const shortService = {
  getShorts: async (): Promise<Short[]> => {
    const response = await api.get('/shorts');
    return response.data.data;
  }
};

export const sponsorService = {
  getSidebarSponsors: async (): Promise<Sponsor[]> => {
    const response = await api.get('/sponsors');
    return response.data.data;
  }
};

export const flashInfoService = {
  getFlashInfos: async (): Promise<FlashInfo[]> => {
    const response = await api.get('/flash-infos');
    return response.data.data;
  }
};

export const bonPlanService = {
  getBonsPlans: async (): Promise<BonPlan[]> => {
    const response = await api.get('/bon-plans');
    return response.data.data;
  }
};

export const usefulNumberService = {
  getUsefulNumbers: async (): Promise<UsefulNumber[]> => {
    const response = await api.get('/useful-numbers');
    return response.data.data;
  }
};
