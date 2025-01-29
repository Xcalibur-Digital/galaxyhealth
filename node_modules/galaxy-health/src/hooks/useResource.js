import { useState, useCallback } from 'react';
import { api } from '../services/api';

export function useResource(resourceType) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchResource = useCallback(async (id, params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.fhir[`get${resourceType}`](id, params);
      setData(response);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [resourceType]);

  const createResource = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.fhir[`create${resourceType}`](data);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [resourceType]);

  const updateResource = useCallback(async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.fhir[`update${resourceType}`](id, data);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [resourceType]);

  return {
    data,
    loading,
    error,
    fetchResource,
    createResource,
    updateResource
  };
} 