import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';
import { type Job, type JobFilters, type PaginatedResponse, type Stats } from '../types';
import toast from 'react-hot-toast';

export const useJobs = (filters: JobFilters = {}) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '' && value !== null) {
      params.append(key, String(value));
    }
  });

  return useQuery<PaginatedResponse<Job>>({
    queryKey: ['jobs', filters],
    queryFn: async () => {
      const { data } = await api.get(`/jobs?${params.toString()}`);
      return data;
    },
  });
};

export const useJob = (id: string) => {
  return useQuery<Job>({
    queryKey: ['job', id],
    queryFn: async () => {
      const { data } = await api.get(`/jobs/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export const useRelatedJobs = (id: string) => {
  return useQuery<Job[]>({
    queryKey: ['relatedJobs', id],
    queryFn: async () => {
      const { data } = await api.get(`/jobs/${id}/related`);
      return data;
    },
    enabled: !!id,
  });
};

export const useCreateJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (jobData: Partial<Job>) => {
      const { data } = await api.post('/jobs', jobData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast.success('Job posted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to post job');
    },
  });
};

export const useDeleteJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/jobs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast.success('Job deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete job');
    },
  });
};

export const useMyJobs = () => {
  return useQuery<PaginatedResponse<Job>>({
    queryKey: ['myJobs'],
    queryFn: async () => {
      const { data } = await api.get('/jobs?postedByMe=true');
      return data;
    },
  });
};

export const useStats = () => {
  return useQuery<Stats>({
    queryKey: ['stats'],
    queryFn: async () => {
      const { data } = await api.get('/stats');
      return data;
    },
  });
};
