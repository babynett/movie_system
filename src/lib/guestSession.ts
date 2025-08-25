// Guest Session Management for TMDB
"use client";

import { tmdbService, GuestSession, RatedMovie } from './tmdb';

const GUEST_SESSION_KEY = 'tmdb_guest_session';
const GUEST_SESSION_EXPIRES_KEY = 'tmdb_guest_session_expires';

class GuestSessionManager {
  private guestSessionId: string | null = null;
  private expiresAt: Date | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.loadFromStorage();
    }
  }

  private loadFromStorage(): void {
    const sessionId = localStorage.getItem(GUEST_SESSION_KEY);
    const expiresAtStr = localStorage.getItem(GUEST_SESSION_EXPIRES_KEY);

    if (sessionId && expiresAtStr) {
      const expiresAt = new Date(expiresAtStr);
      if (expiresAt > new Date()) {
        this.guestSessionId = sessionId;
        this.expiresAt = expiresAt;
      } else {
        this.clearSession();
      }
    }
  }

  private saveToStorage(sessionId: string, expiresAt: Date): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(GUEST_SESSION_KEY, sessionId);
      localStorage.setItem(GUEST_SESSION_EXPIRES_KEY, expiresAt.toISOString());
    }
  }

  private clearSession(): void {
    this.guestSessionId = null;
    this.expiresAt = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem(GUEST_SESSION_KEY);
      localStorage.removeItem(GUEST_SESSION_EXPIRES_KEY);
    }
  }

  async getGuestSessionId(): Promise<string> {
    // Check if current session is valid
    if (this.guestSessionId && this.expiresAt && this.expiresAt > new Date()) {
      return this.guestSessionId;
    }

    // Create new session
    try {
      const session: GuestSession = await tmdbService.createGuestSession();
      if (session.success) {
        const expiresAt = new Date(session.expires_at);
        this.guestSessionId = session.guest_session_id;
        this.expiresAt = expiresAt;
        this.saveToStorage(session.guest_session_id, expiresAt);
        return session.guest_session_id;
      } else {
        throw new Error('Failed to create guest session');
      }
    } catch (error) {
      console.error('Error creating guest session:', error);
      throw error;
    }
  }

  async rateMovie(movieId: number, rating: number): Promise<boolean> {
    try {
      const sessionId = await this.getGuestSessionId();
      const result = await tmdbService.rateMovieGuest(movieId, sessionId, rating);
      return result.success || false;
    } catch (error) {
      console.error('Error rating movie:', error);
      return false;
    }
  }

  async getRatedMovies(): Promise<RatedMovie[]> {
    try {
      if (!this.guestSessionId) {
        await this.getGuestSessionId();
      }
      const sessionId = this.guestSessionId!;
      const result = await tmdbService.getGuestRatedMovies(sessionId);
      return result.results || [];
    } catch (error) {
      console.error('Error getting rated movies:', error);
      return [];
    }
  }

  isSessionValid(): boolean {
    return this.guestSessionId !== null && 
           this.expiresAt !== null && 
           this.expiresAt > new Date();
  }
}

export const guestSessionManager = new GuestSessionManager();
